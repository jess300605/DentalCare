package com.example.dentalcare

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.dentalcare.data.*
import com.example.dentalcare.ui.screens.*
import com.example.dentalcare.ui.theme.DentalCareTheme
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MainAppContainer()
        }
    }
}

private fun todayDateString(): String =
    SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppContainer() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    // Settings States
    var isDarkMode by remember { mutableStateOf(false) }
    var currentLanguage by remember { mutableStateOf("en") } // "en" or "es"
    val isSpanish = currentLanguage == "es"

    val authRepository = remember { AuthRepository() }
    val firestoreRepository = remember { FirestoreRepository() }

    DentalCareTheme(darkTheme = isDarkMode) {
        val navController = rememberNavController()

        // Navigation and contextual selection variables
        var activeRole by remember { mutableStateOf("patient") } // "patient" or "admin"
        var selectedDentist by remember { mutableStateOf<Dentist?>(null) }
        var selectedPatient by remember { mutableStateOf<Patient?>(null) }
        var lastBookingState by remember { mutableStateOf<Appointment?>(null) }
        var editingAppointment by remember { mutableStateOf<Appointment?>(null) } // non-null while rescheduling
        var currentRoute by remember { mutableStateOf("splash") }

        // Shared logout: signs out of Firebase AND clears the cached Google
        // account, so next time "Continue with Google" is tapped it shows
        // the account picker again instead of silently reusing this one.
        val performLogout: () -> Unit = {
            authRepository.logout()
            val googleSignInClient = GoogleSignIn.getClient(context, GoogleSignInOptions.DEFAULT_SIGN_IN)
            googleSignInClient.signOut()
            selectedPatient = null
            selectedDentist = null
            editingAppointment = null
            activeRole = "patient"
            navController.navigate("login") { popUpTo(0) { inclusive = true } }
        }

        // Reacts to Firebase's own auth-state notifications instead of
        // reading currentUser right after a login call returns — this is
        // what was causing the multi-second lag / stuck "User" placeholder
        // when switching accounts.
        val currentUser by produceState<FirebaseUser?>(initialValue = authRepository.currentUser) {
            authRepository.observeAuthState().collect { value = it }
        }
        val uid = currentUser?.uid
        val isAdmin = activeRole == "admin"

        // The Firestore users/{uid} doc is the reliable source for the
        // display name: FirebaseUser.displayName isn't always populated
        // (e.g. accounts created straight in the Firebase console), but the
        // "name" we saved at registration always is.
        val userProfileState by produceState<UserProfile?>(initialValue = null, uid) {
            value = if (uid != null) {
                try {
                    firestoreRepository.getUserProfile(uid)
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    Log.e("DentalCare", "getUserProfile failed", e)
                    null
                }
            } else {
                null
            }
        }
        val resolvedUserName = userProfileState?.name?.takeIf { it.isNotBlank() }
            ?: currentUser?.displayName?.takeIf { it.isNotBlank() }
            ?: (if (isSpanish) "Usuario" else "User")
        val resolvedUserEmail = userProfileState?.email?.takeIf { it.isNotBlank() }
            ?: currentUser?.email
            ?: "user@example.com"

        // ---- Live Firestore-backed state ----
        // Each of these opens a real-time listener scoped to the signed-in
        // user (and role, for appointments/patients). They automatically
        // restart when uid/isAdmin change, e.g. after login or logout.
        // If a listener fails (most often a Firestore permission error),
        // we now surface it instead of leaving the screen silently empty.
        val appointmentsState by produceState(initialValue = emptyList<Appointment>(), uid, isAdmin) {
            if (uid != null) {
                try {
                    firestoreRepository.observeAppointments(uid, isAdmin).collect { value = it }
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    Log.e("DentalCare", "observeAppointments failed", e)
                    Toast.makeText(context, "No se pudieron cargar las citas: ${e.message}", Toast.LENGTH_LONG).show()
                }
            } else {
                value = emptyList()
            }
        }

        val dentistsState by produceState(initialValue = emptyList<Dentist>(), uid) {
            if (uid != null) {
                try {
                    firestoreRepository.observeDentists().collect { value = it }
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    Log.e("DentalCare", "observeDentists failed", e)
                    Toast.makeText(context, "No se pudo cargar la lista de dentistas: ${e.message}", Toast.LENGTH_LONG).show()
                }
            } else {
                value = emptyList()
            }
        }

        val patientsState by produceState(initialValue = emptyList<Patient>(), uid, isAdmin) {
            if (uid != null && isAdmin) {
                try {
                    firestoreRepository.observePatients().collect { value = it }
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    Log.e("DentalCare", "observePatients failed", e)
                    Toast.makeText(context, "No se pudieron cargar los pacientes: ${e.message}", Toast.LENGTH_LONG).show()
                }
            } else {
                value = emptyList()
            }
        }

        val notificationsState by produceState(initialValue = emptyList<NotificationItem>(), uid) {
            if (uid != null) {
                try {
                    firestoreRepository.observeNotifications(uid).collect { value = it }
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    Log.e("DentalCare", "observeNotifications failed", e)
                    Toast.makeText(context, "No se pudieron cargar las notificaciones: ${e.message}", Toast.LENGTH_LONG).show()
                }
            } else {
                value = emptyList()
            }
        }


        // First time an admin opens the app, make sure the dentist catalog
        // isn't empty (one-time seed, no-ops if dentists already exist).
        LaunchedEffect(uid, isAdmin) {
            if (uid != null && isAdmin) {
                firestoreRepository.seedDentistsIfEmpty(InitialData.dentists)
            }
        }

        Scaffold(
            topBar = {
                if (currentRoute != "splash" && currentRoute != "login" && currentRoute != "register") {
                    TopAppBar(
                        title = {
                            Text(
                                text = when (currentRoute) {
                                    "patient-dashboard" -> if (isSpanish) "Inicio" else "DentalCare Home"
                                    "dentist-list" -> if (isSpanish) "Especialistas" else "Our Specialists"
                                    "book-appointment" -> if (isSpanish) "Reservar Cita" else "Book Consultation"
                                    "my-appointments" -> if (isSpanish) "Mis Citas" else "Clinical Schedule"
                                    "notifications" -> if (isSpanish) "Notificaciones" else "Notifications"
                                    "patient-profile" -> if (isSpanish) "Mi Perfil" else "Patient Profile"
                                    "admin-dashboard" -> "Clinical Dashboard"
                                    "manage-dentists" -> if (isSpanish) "Gestionar Dentistas" else "Manage Dentists"
                                    "manage-patients" -> if (isSpanish) "Pacientes" else "Patients"
                                    "appointment-management" -> if (isSpanish) "Gestionar Citas" else "Manage Appointments"
                                    "treatment-registration" -> if (isSpanish) "Registrar Tratamiento" else "Treatment Record"
                                    else -> "DentalCare"
                                },
                                style = MaterialTheme.typography.titleLarge.copy(color = Color.White)
                            )
                        },
                        navigationIcon = {
                            val canGoBack = currentRoute != "patient-dashboard" && currentRoute != "admin-dashboard"
                            if (canGoBack) {
                                IconButton(onClick = { navController.popBackStack() }) {
                                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                                }
                            }
                        },
                        colors = TopAppBarDefaults.topAppBarColors(
                            containerColor = if (activeRole == "admin") Color(0xFF26A69A) else Color(0xFF1976D2)
                        ),
                        actions = {
                            // Admin has no bottom nav / profile screen, so it
                            // needs its own way to log out from anywhere.
                            if (activeRole == "admin") {
                                IconButton(onClick = performLogout) {
                                    Icon(Icons.Default.Logout, contentDescription = "Log out", tint = Color.White)
                                }
                            }
                        }
                    )
                }
            },
            bottomBar = {
                val showBottomNav = currentRoute == "patient-dashboard" || currentRoute == "dentist-list" || currentRoute == "my-appointments" || currentRoute == "patient-profile"
                if (showBottomNav && activeRole == "patient") {
                    NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                        NavigationBarItem(
                            selected = currentRoute == "patient-dashboard",
                            onClick = { navController.navigate("patient-dashboard") },
                            icon = { Icon(Icons.Default.Home, contentDescription = null) },
                            label = { Text(if (isSpanish) "Inicio" else "Home", fontSize = 11.sp) }
                        )
                        NavigationBarItem(
                            selected = currentRoute == "dentist-list",
                            onClick = { navController.navigate("dentist-list") },
                            icon = { Icon(Icons.Default.MedicalServices, contentDescription = null) },
                            label = { Text(if (isSpanish) "Doctores" else "Dentists", fontSize = 11.sp) }
                        )
                        NavigationBarItem(
                            selected = currentRoute == "my-appointments",
                            onClick = { navController.navigate("my-appointments") },
                            icon = { Icon(Icons.Default.CalendarToday, contentDescription = null) },
                            label = { Text(if (isSpanish) "Citas" else "Schedule", fontSize = 11.sp) }
                        )
                        NavigationBarItem(
                            selected = currentRoute == "patient-profile",
                            onClick = { navController.navigate("patient-profile") },
                            icon = { Icon(Icons.Default.AccountCircle, contentDescription = null) },
                            label = { Text(if (isSpanish) "Perfil" else "Profile", fontSize = 11.sp) }
                        )
                    }
                }
            }
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = "splash",
                modifier = Modifier.padding(innerPadding)
            ) {
                composable("splash") {
                    currentRoute = "splash"
                    SplashScreen(onEnterApp = {
                        navController.navigate("login") { popUpTo("splash") { inclusive = true } }
                    })
                }

                composable("login") {
                    currentRoute = "login"
                    LoginScreen(
                        onLogin = { role ->
                            activeRole = role
                            val msg = if (isSpanish) "Sesión iniciada como $role" else "Logged in as $role"
                            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                            val dest = if (role == "admin") "admin-dashboard" else "patient-dashboard"
                            navController.navigate(dest) { popUpTo("login") { inclusive = true } }
                        },
                        onGoToRegister = { navController.navigate("register") }
                    )
                }

                composable("register") {
                    currentRoute = "register"
                    RegisterScreen(
                        onRegister = { name ->
                            activeRole = "patient"
                            val msg = if (isSpanish) "¡Bienvenido $name!" else "Welcome $name!"
                            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                            navController.navigate("patient-dashboard") { popUpTo("login") { inclusive = true } }
                        },
                        onGoToLogin = { navController.popBackStack() }
                    )
                }

                composable("patient-dashboard") {
                    currentRoute = "patient-dashboard"
                    PatientDashboardScreen(
                        appointments = appointmentsState,
                        notifications = notificationsState,
                        userName = resolvedUserName,
                        onNavigate = { route -> navController.navigate(route) },
                        onSelectAppointment = { /* Select */ }
                    )
                }

                composable("dentist-list") {
                    currentRoute = "dentist-list"
                    DentistListScreen(
                        dentists = dentistsState,
                        onSelectDentist = { doc ->
                            editingAppointment = null // fresh booking, not editing one
                            selectedDentist = doc
                            navController.navigate("book-appointment")
                        }
                    )
                }

                composable("book-appointment") {
                    currentRoute = "book-appointment"
                    val editing = editingAppointment
                    BookAppointmentScreen(
                        dentists = dentistsState,
                        selectedDentist = selectedDentist ?: dentistsState.getOrNull(0),
                        onSelectDentist = { selectedDentist = it },
                        initialDate = editing?.date ?: "2026-07-25",
                        initialTime = editing?.time ?: "10:00 AM",
                        initialReason = editing?.reason ?: "",
                        isRescheduling = editing != null,
                        onConfirmBooking = { dentist, date, time, reason ->
                            val uName = resolvedUserName
                            val patientUid = uid ?: ""

                            scope.launch {
                                if (editing != null) {
                                    // ---- Rescheduling an existing appointment ----
                                    val result = firestoreRepository.rescheduleAppointment(
                                        appointmentId = editing.id,
                                        oldDentistId = editing.dentistId,
                                        oldDate = editing.date,
                                        oldTime = editing.time,
                                        newDentist = dentist,
                                        newDate = date,
                                        newTime = time,
                                        newReason = reason
                                    )
                                    if (result.isSuccess) {
                                        firestoreRepository.addNotification(
                                            NotificationItem(
                                                userId = patientUid,
                                                type = NotificationType.UPDATED,
                                                title = if (isSpanish) "Cita Reprogramada" else "Appointment Rescheduled",
                                                message = if (isSpanish)
                                                    "Tu cita con ${dentist.name} fue movida al $date a las $time."
                                                else
                                                    "Your appointment with ${dentist.name} was moved to $date at $time.",
                                                time = if (isSpanish) "justo ahora" else "just now"
                                            )
                                        )
                                        editingAppointment = null
                                        lastBookingState = editing.copy(
                                            dentistId = dentist.id,
                                            dentistName = dentist.name,
                                            dentistSpecialty = dentist.specialty,
                                            date = date,
                                            time = time,
                                            reason = reason
                                        )
                                        navController.navigate("appointment-confirmation") { popUpTo("book-appointment") { inclusive = true } }
                                    } else if (result.exceptionOrNull() is SlotTakenException) {
                                        Toast.makeText(
                                            context,
                                            if (isSpanish) "Ese horario ya está ocupado. Elige otro." else "That time slot is already taken. Pick another.",
                                            Toast.LENGTH_LONG
                                        ).show()
                                    } else {
                                        Toast.makeText(context, "Error: ${result.exceptionOrNull()?.message}", Toast.LENGTH_LONG).show()
                                    }
                                } else {
                                    // ---- New booking ----
                                    val newAppt = Appointment(
                                        patientId = patientUid,
                                        dentistId = dentist.id,
                                        dentistName = dentist.name,
                                        dentistSpecialty = dentist.specialty,
                                        date = date,
                                        time = time,
                                        patientName = uName,
                                        reason = reason,
                                        status = AppointmentStatus.Confirmed
                                    )
                                    val result = firestoreRepository.bookAppointment(newAppt)
                                    if (result.isSuccess) {
                                        firestoreRepository.addNotification(
                                            NotificationItem(
                                                userId = patientUid,
                                                type = NotificationType.CONFIRMED,
                                                title = if (isSpanish) "Cita Confirmada" else "Appointment Confirmed",
                                                message = if (isSpanish)
                                                    "Tu cita con ${dentist.name} el $date a las $time ha sido registrada."
                                                else
                                                    "Your appointment with ${dentist.name} on $date at $time has been booked.",
                                                time = if (isSpanish) "justo ahora" else "just now"
                                            )
                                        )
                                        lastBookingState = newAppt.copy(id = result.getOrNull() ?: "")
                                        navController.navigate("appointment-confirmation") { popUpTo("book-appointment") { inclusive = true } }
                                    } else if (result.exceptionOrNull() is SlotTakenException) {
                                        Toast.makeText(
                                            context,
                                            if (isSpanish) "Ese horario ya está ocupado. Elige otro." else "That time slot is already taken. Pick another.",
                                            Toast.LENGTH_LONG
                                        ).show()
                                    } else {
                                        Toast.makeText(context, "Error: ${result.exceptionOrNull()?.message}", Toast.LENGTH_LONG).show()
                                    }
                                }
                            }
                        }
                    )
                }

                composable("appointment-confirmation") {
                    currentRoute = "appointment-confirmation"
                    val lastB = lastBookingState
                    AppointmentConfirmationScreen(
                        dentistName = lastB?.dentistName ?: "Dr. Sarah Miller",
                        date = lastB?.date ?: "2026-07-25",
                        time = lastB?.time ?: "10:00 AM",
                        reason = lastB?.reason ?: "Regular Checkup",
                        onFinish = { navController.navigate("patient-dashboard") { popUpTo("patient-dashboard") { inclusive = false } } }
                    )
                }

                composable("my-appointments") {
                    currentRoute = "my-appointments"
                    MyAppointmentsScreen(
                        appointments = appointmentsState,
                        onCancel = { id ->
                            scope.launch { firestoreRepository.updateAppointmentStatus(id, AppointmentStatus.Cancelled) }
                        },
                        onReschedule = { id ->
                            val appt = appointmentsState.find { it.id == id }
                            editingAppointment = appt
                            selectedDentist = dentistsState.find { it.id == appt?.dentistId }
                            navController.navigate("book-appointment")
                        }
                    )
                }

                composable("notifications") {
                    currentRoute = "notifications"
                    NotificationsScreen(
                        notifications = notificationsState,
                        onMarkAsRead = { id ->
                            scope.launch { firestoreRepository.markNotificationRead(id) }
                        },
                        onClearAll = {
                            scope.launch { firestoreRepository.clearNotifications(notificationsState.map { it.id }) }
                        }
                    )
                }

                composable("patient-profile") {
                    currentRoute = "patient-profile"
                    PatientProfileScreen(
                        userName = resolvedUserName,
                        userEmail = resolvedUserEmail,
                        isDarkMode = isDarkMode,
                        onThemeChange = { isDarkMode = it },
                        currentLanguage = currentLanguage,
                        onLanguageChange = { currentLanguage = it },
                        onLogout = performLogout
                    )
                }

                composable("admin-dashboard") {
                    currentRoute = "admin-dashboard"
                    AdminDashboardScreen(
                        appointments = appointmentsState,
                        patients = patientsState,
                        dentists = dentistsState,
                        onNavigate = { route -> navController.navigate(route) }
                    )
                }

                // ---- These four routes were referenced by the admin
                // dashboard but never registered here, so tapping any of
                // its cards used to crash the app. Now they're wired to
                // real Firestore reads/writes. ----

                composable("manage-dentists") {
                    currentRoute = "manage-dentists"
                    ManageDentistsScreen(
                        dentists = dentistsState,
                        onAddDentist = { newDoc ->
                            scope.launch { firestoreRepository.addDentist(newDoc) }
                        },
                        onDeleteDentist = { id ->
                            scope.launch { firestoreRepository.deleteDentist(id) }
                        },
                        onToggleAvailability = { id ->
                            val doc = dentistsState.find { it.id == id }
                            if (doc != null) {
                                scope.launch { firestoreRepository.toggleDentistAvailability(id, !doc.availableToday) }
                            }
                        }
                    )
                }

                composable("manage-patients") {
                    currentRoute = "manage-patients"
                    ManagePatientsScreen(
                        patients = patientsState,
                        onSelectPatient = { p -> selectedPatient = p },
                        onNavigate = { route -> navController.navigate(route) }
                    )
                }

                composable("appointment-management") {
                    currentRoute = "appointment-management"
                    AppointmentManagementScreen(
                        appointments = appointmentsState,
                        onUpdateStatus = { id, status ->
                            scope.launch { firestoreRepository.updateAppointmentStatus(id, status) }
                        }
                    )
                }

                composable("treatment-registration") {
                    currentRoute = "treatment-registration"
                    TreatmentRegistrationScreen(
                        selectedPatient = selectedPatient,
                        onSaveTreatment = { patientId, diagnosis, treatment, observations ->
                            scope.launch {
                                firestoreRepository.addTreatmentRecord(
                                    patientId,
                                    TreatmentRecord(
                                        date = todayDateString(),
                                        diagnosis = diagnosis,
                                        treatment = treatment,
                                        observations = observations
                                    )
                                )
                            }
                        },
                        onBack = { navController.popBackStack() }
                    )
                }
            }
        }
    }
}
