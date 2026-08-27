package com.example.dentalcare

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
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

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DentalCareTheme {
                MainAppContainer()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppContainer() {
    val navController = rememberNavController()
    val context = LocalContext.current

    // Global clinical states (using remember/mutableStateList or standard states)
    var dentistsState by remember { mutableStateOf(InitialData.dentists) }
    var patientsState by remember { mutableStateOf(InitialData.patients) }
    var appointmentsState by remember { mutableStateOf(InitialData.appointments) }
    var notificationsState by remember { mutableStateOf(InitialData.notifications) }

    // Navigation and contextual selection variables
    var activeRole by remember { mutableStateOf("patient") } // "patient" or "admin"
    var selectedDentist by remember { mutableStateOf<Dentist?>(null) }
    var selectedPatient by remember { mutableStateOf<Patient?>(InitialData.patients[0]) }
    var lastBookingState by remember { mutableStateOf<Appointment?>(null) }

    // Dynamic TopBar Title helper
    var currentRoute by remember { mutableStateOf("splash") }

    Scaffold(
        topBar = {
            if (currentRoute != "splash" && currentRoute != "login" && currentRoute != "register") {
                TopAppBar(
                    title = {
                        Text(
                            text = when (currentRoute) {
                                "patient-dashboard" -> "DentalCare Home"
                                "dentist-list" -> "Our Specialists"
                                "book-appointment" -> "Book Dental Consultation"
                                "appointment-confirmation" -> "Confirmation Success"
                                "my-appointments" -> "Clinical Schedule"
                                "notifications" -> "Clinical Notifications"
                                "patient-profile" -> "Patient Profile"
                                "admin-dashboard" -> "Clinical Dashboard"
                                "manage-dentists" -> "Doctor Roster"
                                "manage-patients" -> "Patient Records"
                                "treatment-registration" -> "Register Treatment"
                                else -> "DentalCare"
                            },
                            style = MaterialTheme.typography.titleLarge.copy(color = Color.White)
                        )
                    },
                    navigationIcon = {
                        val canGoBack = currentRoute != "patient-dashboard" && currentRoute != "admin-dashboard"
                        if (canGoBack) {
                            IconButton(onClick = {
                                navController.popBackStack()
                            }) {
                                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                            }
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = if (activeRole == "admin") Color(0xFF26A69A) else Color(0xFF1976D2)
                    )
                )
            }
        },
        bottomBar = {
            val showBottomNav = currentRoute == "patient-dashboard" || currentRoute == "dentist-list" || currentRoute == "my-appointments" || currentRoute == "patient-profile"
            if (showBottomNav && activeRole == "patient") {
                NavigationBar(containerColor = Color.White) {
                    NavigationBarItem(
                        selected = currentRoute == "patient-dashboard",
                        onClick = {
                            currentRoute = "patient-dashboard"
                            navController.navigate("patient-dashboard") {
                                popUpTo("patient-dashboard") { inclusive = false }
                            }
                        },
                        icon = { Icon(Icons.Default.Home, contentDescription = null) },
                        label = { Text("Home", fontSize = 11.sp) }
                    )
                    NavigationBarItem(
                        selected = currentRoute == "dentist-list",
                        onClick = {
                            currentRoute = "dentist-list"
                            navController.navigate("dentist-list")
                        },
                        icon = { Icon(Icons.Default.MedicalServices, contentDescription = null) },
                        label = { Text("Dentists", fontSize = 11.sp) }
                    )
                    NavigationBarItem(
                        selected = currentRoute == "my-appointments",
                        onClick = {
                            currentRoute = "my-appointments"
                            navController.navigate("my-appointments")
                        },
                        icon = { Icon(Icons.Default.CalendarToday, contentDescription = null) },
                        label = { Text("Schedule", fontSize = 11.sp) }
                    )
                    NavigationBarItem(
                        selected = currentRoute == "patient-profile",
                        onClick = {
                            currentRoute = "patient-profile"
                            navController.navigate("patient-profile")
                        },
                        icon = { Icon(Icons.Default.AccountCircle, contentDescription = null) },
                        label = { Text("Profile", fontSize = 11.sp) }
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
            // Screen 1: Splash Screen
            composable("splash") {
                currentRoute = "splash"
                SplashScreen(onEnterApp = {
                    navController.navigate("login") {
                        popUpTo("splash") { inclusive = true }
                    }
                })
            }

            // Screen 2: Login Screen
            composable("login") {
                currentRoute = "login"
                LoginScreen(
                    onLogin = { role ->
                        activeRole = role
                        Toast.makeText(context, "Logged in successfully as $role", Toast.LENGTH_SHORT).show()
                        if (role == "admin") {
                            navController.navigate("admin-dashboard") {
                                popUpTo("login") { inclusive = true }
                            }
                        } else {
                            navController.navigate("patient-dashboard") {
                                popUpTo("login") { inclusive = true }
                            }
                        }
                    },
                    onGoToRegister = {
                        navController.navigate("register")
                    }
                )
            }

            // Screen 3: Register Screen
            composable("register") {
                currentRoute = "register"
                RegisterScreen(
                    onRegister = {
                        activeRole = "patient"
                        Toast.makeText(context, "Registration complete! Welcome Alex.", Toast.LENGTH_SHORT).show()
                        navController.navigate("patient-dashboard") {
                            popUpTo("login") { inclusive = true }
                        }
                    },
                    onGoToLogin = {
                        navController.popBackStack()
                    }
                )
            }

            // Screen 4: Patient Dashboard Screen
            composable("patient-dashboard") {
                currentRoute = "patient-dashboard"
                PatientDashboardScreen(
                    appointments = appointmentsState,
                    notifications = notificationsState,
                    onNavigate = { route ->
                        currentRoute = route
                        navController.navigate(route)
                    },
                    onSelectAppointment = { /* Select */ }
                )
            }

            // Screen 5: Dentist List Screen
            composable("dentist-list") {
                currentRoute = "dentist-list"
                DentistListScreen(
                    dentists = dentistsState,
                    onSelectDentist = { dentist ->
                        selectedDentist = dentist
                        navController.navigate("book-appointment")
                    }
                )
            }

            // Screen 6: Book Appointment Screen
            composable("book-appointment") {
                currentRoute = "book-appointment"
                BookAppointmentScreen(
                    dentists = dentistsState,
                    selectedDentist = selectedDentist ?: dentistsState[0],
                    onSelectDentist = { selectedDentist = it },
                    onConfirmBooking = { dentist, date, time, reason ->
                        val newAppt = Appointment(
                            id = "a_" + System.currentTimeMillis(),
                            dentistId = dentist.id,
                            dentistName = dentist.name,
                            dentistSpecialty = dentist.specialty,
                            date = date,
                            time = time,
                            patientName = "Alex Johnson",
                            reason = reason,
                            status = AppointmentStatus.Confirmed,
                            notes = "Brushing teeth before treatment is requested."
                        )
                        appointmentsState = listOf(newAppt) + appointmentsState

                        val newNotif = NotificationItem(
                            id = "n_" + System.currentTimeMillis(),
                            type = NotificationType.CONFIRMED,
                            title = "Appointment Confirmed",
                            message = "Your clinical schedule with ${dentist.name} on $date at $time is secured.",
                            time = "Just now"
                        )
                        notificationsState = listOf(newNotif) + notificationsState

                        lastBookingState = newAppt
                        navController.navigate("appointment-confirmation") {
                            popUpTo("book-appointment") { inclusive = true }
                        }
                    }
                )
            }

            // Screen 7: Appointment Confirmation Screen
            composable("appointment-confirmation") {
                currentRoute = "appointment-confirmation"
                val lastB = lastBookingState
                AppointmentConfirmationScreen(
                    dentistName = lastB?.dentistName ?: "Dr. Sarah Miller",
                    date = lastB?.date ?: "2026-07-25",
                    time = lastB?.time ?: "10:00 AM",
                    reason = lastB?.reason ?: "Regular Routine Cleaning",
                    onFinish = {
                        navController.navigate("patient-dashboard") {
                            popUpTo("patient-dashboard") { inclusive = false }
                        }
                    }
                )
            }

            // Screen 8: My Appointments Screen
            composable("my-appointments") {
                currentRoute = "my-appointments"
                MyAppointmentsScreen(
                    appointments = appointmentsState,
                    onCancel = { id ->
                        appointmentsState = appointmentsState.map {
                            if (it.id == id) it.copy(status = AppointmentStatus.Cancelled) else it
                        }
                        Toast.makeText(context, "Appointment cancelled.", Toast.LENGTH_SHORT).show()
                    },
                    onReschedule = { id ->
                        val appt = appointmentsState.find { it.id == id }
                        selectedDentist = dentistsState.find { it.id == appt?.dentistId }
                        navController.navigate("book-appointment")
                    }
                )
            }

            // Screen 9: Clinical Notifications Screen
            composable("notifications") {
                currentRoute = "notifications"
                NotificationsScreen(
                    notifications = notificationsState,
                    onMarkAsRead = { id ->
                        notificationsState = notificationsState.map {
                            if (it.id == id) it.copy(read = true) else it
                        }
                    },
                    onClearAll = {
                        notificationsState = emptyList()
                        Toast.makeText(context, "Notifications cleared", Toast.LENGTH_SHORT).show()
                    }
                )
            }

            // Screen 10: Patient Profile Screen
            composable("patient-profile") {
                currentRoute = "patient-profile"
                PatientProfileScreen(onLogout = {
                    navController.navigate("login") {
                        popUpTo("patient-dashboard") { inclusive = true }
                    }
                })
            }

            // Screen 11: Admin Dashboard Screen
            composable("admin-dashboard") {
                currentRoute = "admin-dashboard"
                AdminDashboardScreen(
                    appointments = appointmentsState,
                    patients = patientsState,
                    dentists = dentistsState,
                    onNavigate = { route ->
                        currentRoute = route
                        navController.navigate(route)
                    }
                )
            }

            // Screen 12: Manage Dentists Screen
            composable("manage-dentists") {
                currentRoute = "manage-dentists"
                ManageDentistsScreen(
                    dentists = dentistsState,
                    onAddDentist = { newDoc ->
                        dentistsState = dentistsState + newDoc
                        Toast.makeText(context, "${newDoc.name} registered.", Toast.LENGTH_SHORT).show()
                    },
                    onDeleteDentist = { id ->
                        dentistsState = dentistsState.filter { it.id != id }
                        Toast.makeText(context, "Dentist removed from clinical records.", Toast.LENGTH_SHORT).show()
                    },
                    onToggleAvailability = { id ->
                        dentistsState = dentistsState.map {
                            if (it.id == id) it.copy(availableToday = !it.availableToday) else it
                        }
                    }
                )
            }

            // Screen 13: Manage Patients Screen
            composable("manage-patients") {
                currentRoute = "manage-patients"
                ManagePatientsScreen(
                    patients = patientsState,
                    onSelectPatient = { selectedPatient = it },
                    onNavigate = { route ->
                        currentRoute = route
                        navController.navigate(route)
                    }
                )
            }

            // Screen 14: Treatment Registration Screen (Digital Dental Records)
            composable("treatment-registration") {
                currentRoute = "treatment-registration"
                TreatmentRegistrationScreen(
                    selectedPatient = selectedPatient,
                    onSaveTreatment = { patientId, diagnosis, treatment, observations ->
                        patientsState = patientsState.map { p ->
                            if (p.id == patientId) {
                                p.copy(
                                    lastVisit = "2026-07-18",
                                    history = listOf(
                                        TreatmentRecord("2026-07-18", diagnosis, treatment, observations)
                                    ) + p.history
                                )
                            } else p
                        }
                        // Update current selection context
                        selectedPatient = patientsState.find { it.id == patientId }

                        // Create notification update
                        val treatmentNotif = NotificationItem(
                            id = "n_" + System.currentTimeMillis(),
                            type = NotificationType.UPDATED,
                            title = "Clinical Treatment Posted",
                            message = "A new diagnosis ($treatment) was appended to your clinical card.",
                            time = "Just now"
                        )
                        notificationsState = listOf(treatmentNotif) + notificationsState
                        Toast.makeText(context, "Treatment log successfully saved.", Toast.LENGTH_SHORT).show()
                    },
                    onBack = {
                        navController.popBackStack()
                    }
                )
            }
        }
    }
}
