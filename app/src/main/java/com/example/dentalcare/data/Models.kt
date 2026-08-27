package com.example.dentalcare.data

import java.util.UUID

enum class AppointmentStatus {
    Pending, Confirmed, Completed, Cancelled
}

enum class NotificationType {
    CONFIRMED, REMINDER, UPDATED, CANCELLED
}

data class Dentist(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val specialty: String,
    val rating: Double,
    val reviewsCount: Int,
    val availableToday: Boolean,
    val avatarColor: String, // String representation for styling
    val imageUrl: String? = null
)

data class TreatmentRecord(
    val date: String,
    val diagnosis: String,
    val treatment: String,
    val observations: String
)

data class Patient(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val phone: String,
    val lastVisit: String,
    val nextAppointment: String? = null,
    val history: List<TreatmentRecord> = emptyList()
)

data class Appointment(
    val id: String = UUID.randomUUID().toString(),
    val dentistId: String,
    val dentistName: String,
    val dentistSpecialty: String,
    val date: String,
    val time: String,
    val patientName: String,
    val reason: String,
    val status: AppointmentStatus,
    val notes: String? = null,
    val diagnosis: String? = null,
    val treatment: String? = null,
    val observations: String? = null
)

data class NotificationItem(
    val id: String = UUID.randomUUID().toString(),
    val type: NotificationType,
    val title: String,
    val message: String,
    val time: String,
    val read: Boolean = false
)

object InitialData {
    val dentists = listOf(
        Dentist(
            id = "d1",
            name = "Dr. Sarah Miller",
            specialty = "Orthodontics & Aesthetic Dentistry",
            rating = 4.9,
            reviewsCount = 142,
            availableToday = true,
            avatarColor = "Primary"
        ),
        Dentist(
            id = "d2",
            name = "Dr. Marcus Vance",
            specialty = "Pediatric Dentistry Specialist",
            rating = 4.8,
            reviewsCount = 98,
            availableToday = true,
            avatarColor = "Secondary"
        ),
        Dentist(
            id = "d3",
            name = "Dr. Elena Rostova",
            specialty = "Periodontist & Oral Implantologist",
            rating = 4.9,
            reviewsCount = 115,
            availableToday = true,
            avatarColor = "Tertiary"
        ),
        Dentist(
            id = "d4",
            name = "Dr. James Carter",
            specialty = "Endodontics (Root Canal Specialist)",
            rating = 4.7,
            reviewsCount = 84,
            availableToday = false,
            avatarColor = "Variant"
        )
    )

    val patients = listOf(
        Patient(
            id = "p1",
            name = "Alex Johnson",
            email = "alex.johnson@example.com",
            phone = "+1 (555) 234-5678",
            lastVisit = "2026-04-12",
            nextAppointment = "2026-07-19",
            history = listOf(
                TreatmentRecord(
                    date = "2026-04-12",
                    diagnosis = "Mild dental plaque accumulation and localized gingivitis",
                    treatment = "Professional Prophylaxis & Scaling",
                    observations = "Advised patient to use soft-bristled brush and floss daily. Schedule check-up in 3 months."
                ),
                TreatmentRecord(
                    date = "2025-10-15",
                    diagnosis = "Incipient cavity on lower left molar (tooth 36)",
                    treatment = "Composite Resin Filling (Tooth 36)",
                    observations = "Excellent cooperation. Cavity successfully restored. Check margins at next recall."
                )
            )
        ),
        Patient(
            id = "p2",
            name = "Jane Smith",
            email = "jane.smith@example.com",
            phone = "+1 (555) 987-6543",
            lastVisit = "2026-05-20",
            nextAppointment = "2026-07-20",
            history = listOf(
                TreatmentRecord(
                    date = "2026-05-20",
                    diagnosis = "Moderate deep dentinal caries on tooth 45",
                    treatment = "Indirect Pulp Capping & Ceramic Onlay",
                    observations = "Monitored pulp response. Restored anatomy with highly esthetic ceramic onlay."
                )
            )
        ),
        Patient(
            id = "p3",
            name = "David Lee",
            email = "david.lee@example.com",
            phone = "+1 (555) 456-7890",
            lastVisit = "2026-03-10",
            history = listOf(
                TreatmentRecord(
                    date = "2026-03-10",
                    diagnosis = "Impacted wisdom teeth (teeth 18, 28, 38, 48)",
                    treatment = "Surgical extraction of teeth 38 and 48",
                    observations = "Sutures removed. Post-operative healing is excellent. Scheduled remaining extractions."
                )
            )
        ),
        Patient(
            id = "p4",
            name = "Sofia Martinez",
            email = "sofia.m@example.com",
            phone = "+1 (555) 321-0987",
            lastVisit = "2026-06-01",
            nextAppointment = "2026-07-22",
            history = listOf(
                TreatmentRecord(
                    date = "2026-06-01",
                    diagnosis = "Slight tooth sensitivity and enamel erosion",
                    treatment = "Fluoride Varnish Treatment",
                    observations = "Recommended desensitizing toothpaste. Avoid highly acidic beverages."
                )
            )
        )
    )

    val appointments = listOf(
        Appointment(
            id = "a1",
            dentistId = "d1",
            dentistName = "Dr. Sarah Miller",
            dentistSpecialty = "Orthodontics & Aesthetic Dentistry",
            date = "2026-07-19",
            time = "10:00 AM",
            patientName = "Alex Johnson",
            reason = "Routine Cleaning & Orthodontic Checkup",
            status = AppointmentStatus.Confirmed,
            notes = "Please arrive 10 minutes early. Bring your orthodontic retainer case."
        ),
        Appointment(
            id = "a2",
            dentistId = "d2",
            dentistName = "Dr. Marcus Vance",
            dentistSpecialty = "Pediatric Dentistry Specialist",
            date = "2026-07-20",
            time = "02:30 PM",
            patientName = "Jane Smith",
            reason = "Cavity Follow-up & Sealant Placement",
            status = AppointmentStatus.Pending,
            notes = "Checking upper dental arch development."
        ),
        Appointment(
            id = "a3",
            dentistId = "d3",
            dentistName = "Dr. Elena Rostova",
            dentistSpecialty = "Periodontist & Oral Implantologist",
            date = "2026-07-22",
            time = "11:15 AM",
            patientName = "Sofia Martinez",
            reason = "Gingival Bleeding Assessment",
            status = AppointmentStatus.Pending,
            notes = "Deep cleaning pocket measurements requested."
        ),
        Appointment(
            id = "a4",
            dentistId = "d1",
            dentistName = "Dr. Sarah Miller",
            dentistSpecialty = "Orthodontics & Aesthetic Dentistry",
            date = "2026-04-12",
            time = "09:00 AM",
            patientName = "Alex Johnson",
            reason = "Deep Cleaning & Scale",
            status = AppointmentStatus.Completed,
            diagnosis = "Mild dental plaque accumulation and localized gingivitis",
            treatment = "Professional Prophylaxis & Scaling",
            observations = "Advised patient to use soft-bristled brush and floss daily. Schedule check-up in 3 months."
        ),
        Appointment(
            id = "a5",
            dentistId = "d4",
            dentistName = "Dr. James Carter",
            dentistSpecialty = "Endodontics (Root Canal Specialist)",
            date = "2026-07-15",
            time = "04:00 PM",
            patientName = "Alex Johnson",
            reason = "Emergency Tooth Ache Assessment",
            status = AppointmentStatus.Cancelled,
            notes = "Patient called to cancel due to travel conflicts. Rescheduled."
        )
    )

    val notifications = listOf(
        NotificationItem(
            id = "n1",
            type = NotificationType.CONFIRMED,
            title = "Appointment Confirmed",
            message = "Your appointment with Dr. Sarah Miller on July 19 at 10:00 AM has been successfully confirmed by our team.",
            time = "2 hours ago"
        ),
        NotificationItem(
            id = "n2",
            type = NotificationType.REMINDER,
            title = "Reminder: Check-up Tomorrow",
            message = "You have an upcoming appointment with Dr. Sarah Miller tomorrow at 10:00 AM. Please arrive 10 minutes early.",
            time = "1 day ago"
        ),
        NotificationItem(
            id = "n3",
            type = NotificationType.REMINDER,
            title = "Safety Tip: Smile Prep",
            message = "Don't forget to brush your teeth and floss before coming for your treatment. We look forward to seeing your smile!",
            time = "1 day ago",
            read = true
        ),
        NotificationItem(
            id = "n4",
            type = NotificationType.UPDATED,
            title = "Appointment Time Updated",
            message = "Your appointment request has been adjusted to 10:00 AM (originally requested for 9:30 AM) to fit optimal doctor scheduling.",
            time = "2 days ago",
            read = true
        ),
        NotificationItem(
            id = "n5",
            type = NotificationType.CANCELLED,
            title = "Appointment Cancelled",
            message = "Your request for July 15 with Dr. James Carter has been successfully cancelled as per your phone request.",
            time = "3 days ago",
            read = true
        )
    )

    val timeSlots = listOf(
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    )
}
