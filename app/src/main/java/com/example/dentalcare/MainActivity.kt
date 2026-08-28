package com.example.dentalcare

import android.os.Bundle
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

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MainAppContainer()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppContainer() {
    val context = LocalContext.current

    // Settings States
    var isDarkMode by remember { mutableStateOf(false) }
    var currentLanguage by remember { mutableStateOf("en") } // "en" or "es"
    val isSpanish = currentLanguage == "es"

    val authRepository = remember { AuthRepository() }
    val currentUser = authRepository.currentUser

    DentalCareTheme(darkTheme = isDarkMode) {
        val navController = rememberNavController()

        // Global clinical states
        var dentistsState by remember { mutableStateOf(InitialData.dentists) }
        var patientsState by remember { mutableStateOf(InitialData.patients) }
        var appointmentsState by remember { mutableStateOf(InitialData.appointments) }
        var notificationsState by remember { mutableStateOf(InitialData.notifications) }

        // Navigation and contextual selection variables
        var activeRole by remember { mutableStateOf("patient") } // "patient" or "admin"
        var selectedDentist by remember { mutableStateOf<Dentist?>(null) }
        var selectedPatient by remember { mutableStateOf<Patient?>(null) }
        var lastBookingState by remember { mutableStateOf<Appointment?>(null) }

        // Filtered states based on currentUser
        val userAppointments = remember(appointmentsState, currentUser) {
            if (activeRole == "admin") appointmentsState
            else appointmentsState.filter { it.patientName == (currentUser?.displayName ?: "User") }
        }

        val userNotifications = remember(notificationsState, currentUser) {
            if (activeRole == "admin") notificationsState
            else notificationsState
        }

        var currentRoute by remember { mutableStateOf("splash") }

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
                        )
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
                        appointments = userAppointments,
                        notifications = userNotifications,
                        userName = currentUser?.displayName ?: (if (isSpanish) "Usuario" else "User"),
                        onNavigate = { route -> navController.navigate(route) },
                        onSelectAppointment = { /* Select */ }
                    )
                }

                composable("dentist-list") {
                    currentRoute = "dentist-list"
                    DentistListScreen(
                        dentists = dentistsState,
                        onSelectDentist = { doc ->
                            selectedDentist = doc
                            navController.navigate("book-appointment")
                        }
                    )
                }

                composable("book-appointment") {
                    currentRoute = "book-appointment"
                    BookAppointmentScreen(
                        dentists = dentistsState,
                        selectedDentist = selectedDentist ?: dentistsState[0],
                        onSelectDentist = { selectedDentist = it },
                        onConfirmBooking = { dentist, date, time, reason ->
                            val uName = currentUser?.displayName ?: "User"
                            val newAppt = Appointment(
                                id = "a_" + System.currentTimeMillis(),
                                dentistId = dentist.id,
                                dentistName = dentist.name,
                                dentistSpecialty = dentist.specialty,
                                date = date,
                                time = time,
                                patientName = uName,
                                reason = reason,
                                status = AppointmentStatus.Confirmed
                            )
                            appointmentsState = listOf(newAppt) + appointmentsState
                            lastBookingState = newAppt
                            navController.navigate("appointment-confirmation") { popUpTo("book-appointment") { inclusive = true } }
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
                        appointments = userAppointments,
                        onCancel = { id ->
                            appointmentsState = appointmentsState.map { if (it.id == id) it.copy(status = AppointmentStatus.Cancelled) else it }
                        },
                        onReschedule = { id ->
                            val appt = appointmentsState.find { it.id == id }
                            selectedDentist = dentistsState.find { it.id == appt?.dentistId }
                            navController.navigate("book-appointment")
                        }
                    )
                }

                composable("notifications") {
                    currentRoute = "notifications"
                    NotificationsScreen(
                        notifications = userNotifications,
                        onMarkAsRead = { id ->
                            notificationsState = notificationsState.map { if (it.id == id) it.copy(read = true) else it }
                        },
                        onClearAll = { notificationsState = emptyList() }
                    )
                }

                composable("patient-profile") {
                    currentRoute = "patient-profile"
                    PatientProfileScreen(
                        isDarkMode = isDarkMode,
                        onThemeChange = { isDarkMode = it },
                        currentLanguage = currentLanguage,
                        onLanguageChange = { currentLanguage = it },
                        onLogout = {
                            authRepository.logout()
                            navController.navigate("login") { popUpTo(0) { inclusive = true } }
                        }
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
            }
        }
    }
}
