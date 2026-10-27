package com.example.dentalcare.data

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.retryWhen
import kotlinx.coroutines.tasks.await

/**
 * Firestore listeners auto-detach on ANY error, including a transient
 * PERMISSION_DENIED that can happen for a moment right after switching
 * accounts (the new auth token hasn't fully propagated yet). Without a
 * retry, that permanent detachment is what made screens get stuck showing
 * stale/empty data until the app was killed and reopened. This retries a
 * few times with a short backoff before finally giving up and letting the
 * error surface for real.
 */
private fun <T> Flow<T>.retryOnTransientError(maxAttempts: Int = 5): Flow<T> = retryWhen { _, attempt ->
    if (attempt < maxAttempts) {
        delay(400L * (attempt + 1))
        true
    } else {
        false
    }
}

private suspend fun <T> retrySuspend(maxAttempts: Int = 4, block: suspend () -> T): T {
    var lastError: Exception? = null
    repeat(maxAttempts) { attempt ->
        try {
            return block()
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            lastError = e
            delay(400L * (attempt + 1))
        }
    }
    throw lastError ?: IllegalStateException("retry failed")
}

/** Thrown by [FirestoreRepository.bookAppointment] / [FirestoreRepository.rescheduleAppointment]
 *  when the requested dentist+date+time is already taken by someone else. */
class SlotTakenException : Exception("This time slot is already booked")

/**
 * Central Firestore access point for the app.
 *
 * Collections:
 *  - users/{uid}          -> UserProfile (role lives here)
 *  - appointments/{id}    -> Appointment (patientId == owner uid)
 *  - dentists/{id}        -> Dentist (public catalog, admin-writable)
 *  - patients/{id}        -> Patient clinical record (id == uid when linked to an account)
 *  - notifications/{id}   -> NotificationItem (userId == owner uid)
 *
 * This class does NOT decide who is allowed to see what — that is enforced
 * server-side by firestore.rules. If a query asks for data the signed-in
 * user isn't allowed to read, Firestore rejects it regardless of what this
 * code does. That's what makes the per-user isolation real instead of just
 * a client-side filter that a modified app could bypass.
 */
class FirestoreRepository {
    private val db = FirebaseFirestore.getInstance()

    private val usersCol = db.collection("users")
    private val appointmentsCol = db.collection("appointments")
    private val dentistsCol = db.collection("dentists")
    private val patientsCol = db.collection("patients")
    private val notificationsCol = db.collection("notifications")
    // "Lock" documents keyed by dentist+date+time, used to guarantee two
    // patients can never end up booked into the same slot even if they
    // both tap "Confirm" at the exact same moment (see bookAppointment).
    private val slotsCol = db.collection("appointment_slots")

    private fun slotId(dentistId: String, date: String, time: String) = "${dentistId}_${date}_${time}"

    // ---------------- USERS / ROLES ----------------

    suspend fun createUserProfile(profile: UserProfile) {
        usersCol.document(profile.uid).set(profile).await()
    }

    suspend fun getUserProfile(uid: String): UserProfile? = retrySuspend {
        val snap = usersCol.document(uid).get().await()
        snap.toObject(UserProfile::class.java)
    }

    // ---------------- APPOINTMENTS ----------------

    /** Patients only ever see their own appointments; admins see every appointment. */
    fun observeAppointments(uid: String, isAdmin: Boolean): Flow<List<Appointment>> = callbackFlow {
        val query: Query = if (isAdmin) {
            appointmentsCol.orderBy("date", Query.Direction.DESCENDING)
        } else {
            appointmentsCol.whereEqualTo("patientId", uid)
        }
        val registration = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val items = snapshot?.documents?.mapNotNull { it.toObject(Appointment::class.java) } ?: emptyList()
            trySend(items)
        }
        awaitClose { registration.remove() }
    }.retryOnTransientError()

    /**
     * Books a new appointment, atomically guaranteeing that no one else has
     * already taken that exact dentist+date+time. This runs as a Firestore
     * transaction: it checks for (and creates) a "slot lock" document whose
     * ID is deterministic (dentistId_date_time). Firestore transactions are
     * resolved server-side with optimistic concurrency, so even if two
     * patients hit "Confirm" on the same slot in the same instant, only one
     * transaction wins — the other gets [SlotTakenException] and nothing is
     * written. A plain client-side "check the list, then write" would have
     * a race window; this doesn't.
     */
    suspend fun bookAppointment(appointment: Appointment): Result<String> {
        val slotRef = slotsCol.document(slotId(appointment.dentistId, appointment.date, appointment.time))
        val apptRef = appointmentsCol.document()
        return try {
            db.runTransaction { tx ->
                if (tx.get(slotRef).exists()) {
                    throw SlotTakenException()
                }
                tx.set(
                    slotRef,
                    mapOf(
                        "appointmentId" to apptRef.id,
                        "patientId" to appointment.patientId,
                        "dentistId" to appointment.dentistId,
                        "date" to appointment.date,
                        "time" to appointment.time
                    )
                )
                tx.set(apptRef, appointment.copy(id = apptRef.id))
            }.await()
            Result.success(apptRef.id)
        } catch (e: CancellationException) {
            throw e
        } catch (e: SlotTakenException) {
            Result.failure(e)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Moves an existing appointment to a new dentist/date/time, freeing its
     * old slot and locking the new one in the same transaction — so a
     * reschedule can never collide with someone else's booking either, and
     * the original appointment is edited in place instead of leaving a
     * duplicate behind.
     */
    suspend fun rescheduleAppointment(
        appointmentId: String,
        oldDentistId: String,
        oldDate: String,
        oldTime: String,
        newDentist: Dentist,
        newDate: String,
        newTime: String,
        newReason: String
    ): Result<Unit> {
        val oldSlotRef = slotsCol.document(slotId(oldDentistId, oldDate, oldTime))
        val newSlotRef = slotsCol.document(slotId(newDentist.id, newDate, newTime))
        val apptRef = appointmentsCol.document(appointmentId)
        val slotChanged = oldSlotRef.id != newSlotRef.id
        return try {
            db.runTransaction { tx ->
                if (slotChanged && tx.get(newSlotRef).exists()) {
                    throw SlotTakenException()
                }
                val current = tx.get(apptRef).toObject(Appointment::class.java)
                    ?: throw IllegalStateException("Appointment not found")

                tx.set(
                    apptRef,
                    current.copy(
                        dentistId = newDentist.id,
                        dentistName = newDentist.name,
                        dentistSpecialty = newDentist.specialty,
                        date = newDate,
                        time = newTime,
                        reason = newReason
                    )
                )

                if (slotChanged) {
                    tx.delete(oldSlotRef)
                    tx.set(
                        newSlotRef,
                        mapOf(
                            "appointmentId" to appointmentId,
                            "patientId" to current.patientId,
                            "dentistId" to newDentist.id,
                            "date" to newDate,
                            "time" to newTime
                        )
                    )
                }
            }.await()
            Result.success(Unit)
        } catch (e: CancellationException) {
            throw e
        } catch (e: SlotTakenException) {
            Result.failure(e)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /** A dentist's own schedule — every appointment assigned to them, any patient. */
    fun observeAppointmentsForDentist(dentistId: String): Flow<List<Appointment>> = callbackFlow {
        val registration = appointmentsCol.whereEqualTo("dentistId", dentistId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val items = snapshot?.documents?.mapNotNull { it.toObject(Appointment::class.java) } ?: emptyList()
                trySend(items)
            }
        awaitClose { registration.remove() }
    }.retryOnTransientError()

    /** Cancelling frees up the slot so someone else can book it. */
    suspend fun updateAppointmentStatus(id: String, status: AppointmentStatus) {
        if (status == AppointmentStatus.Cancelled) {
            val snap = appointmentsCol.document(id).get().await()
            val appt = snap.toObject(Appointment::class.java)
            if (appt != null) {
                slotsCol.document(slotId(appt.dentistId, appt.date, appt.time)).delete().await()
            }
        }
        appointmentsCol.document(id).update("status", status).await()
    }

    // ---------------- DENTISTS ----------------

    fun observeDentists(): Flow<List<Dentist>> = callbackFlow {
        val registration = dentistsCol.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val items = snapshot?.documents?.mapNotNull { it.toObject(Dentist::class.java) } ?: emptyList()
            trySend(items)
        }
        awaitClose { registration.remove() }
    }.retryOnTransientError()

    suspend fun addDentist(dentist: Dentist) {
        val ref = dentistsCol.document()
        ref.set(dentist.copy(id = ref.id)).await()
    }

    suspend fun deleteDentist(id: String) {
        dentistsCol.document(id).delete().await()
    }

    suspend fun toggleDentistAvailability(id: String, availableToday: Boolean) {
        dentistsCol.document(id).update("availableToday", availableToday).await()
    }

    /** Runs once: if the dentists catalog is empty, populate it with the demo roster. */
    suspend fun seedDentistsIfEmpty(seed: List<Dentist>) {
        val existing = dentistsCol.limit(1).get().await()
        if (existing.isEmpty) {
            seed.forEach { dentist ->
                val ref = dentistsCol.document()
                ref.set(dentist.copy(id = ref.id)).await()
            }
        }
    }

    // ---------------- PATIENTS (clinical records) ----------------

    fun observePatients(): Flow<List<Patient>> = callbackFlow {
        val registration = patientsCol.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val items = snapshot?.documents?.mapNotNull { it.toObject(Patient::class.java) } ?: emptyList()
            trySend(items)
        }
        awaitClose { registration.remove() }
    }.retryOnTransientError()

    suspend fun createPatientRecord(patient: Patient) {
        patientsCol.document(patient.id).set(patient).await()
    }

    suspend fun addTreatmentRecord(patientId: String, record: TreatmentRecord) {
        val snap = patientsCol.document(patientId).get().await()
        val current = snap.toObject(Patient::class.java) ?: return
        val updatedHistory = listOf(record) + current.history
        patientsCol.document(patientId).update(
            mapOf(
                "history" to updatedHistory,
                "lastVisit" to record.date
            )
        ).await()
    }

    // ---------------- NOTIFICATIONS ----------------

    fun observeNotifications(uid: String): Flow<List<NotificationItem>> = callbackFlow {
        val registration = notificationsCol.whereEqualTo("userId", uid)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val items = snapshot?.documents?.mapNotNull { it.toObject(NotificationItem::class.java) } ?: emptyList()
                trySend(items)
            }
        awaitClose { registration.remove() }
    }.retryOnTransientError()

    suspend fun addNotification(notification: NotificationItem) {
        val ref = notificationsCol.document()
        ref.set(notification.copy(id = ref.id)).await()
    }

    suspend fun markNotificationRead(id: String) {
        notificationsCol.document(id).update("read", true).await()
    }

    suspend fun clearNotifications(ids: List<String>) {
        ids.forEach { notificationsCol.document(it).delete().await() }
    }
}
