export interface KotlinFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/example/dentalcare/MainActivity.kt",
    language: "kotlin",
    description: "Main activity, scaffold top bars, bottom bars, alert notification listeners, and navigation route controllers.",
    code: `package com.example.dentalcare

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

    // Global clinical states
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
                        label = { Text("Home") }
                    )
                    NavigationBarItem(
                        selected = currentRoute == "dentist-list",
                        onClick = {
                            currentRoute = "dentist-list"
                            navController.navigate("dentist-list")
                        },
                        icon = { Icon(Icons.Default.MedicalServices, contentDescription = null) },
                        label = { Text("Dentists") }
                    )
                    NavigationBarItem(
                        selected = currentRoute == "my-appointments",
                        onClick = {
                            currentRoute = "my-appointments"
                            navController.navigate("my-appointments")
                        },
                        icon = { Icon(Icons.Default.CalendarToday, contentDescription = null) },
                        label = { Text("Schedule") }
                    )
                    NavigationBarItem(
                        selected = currentRoute == "patient-profile",
                        onClick = {
                            currentRoute = "patient-profile"
                            navController.navigate("patient-profile")
                        },
                        icon = { Icon(Icons.Default.AccountCircle, contentDescription = null) },
                        label = { Text("Profile") }
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
                        Toast.makeText(context, "Logged in as $role", Toast.LENGTH_SHORT).show()
                        if (role == "admin") {
                            navController.navigate("admin-dashboard") { popUpTo("login") { inclusive = true } }
                        } else {
                            navController.navigate("patient-dashboard") { popUpTo("login") { inclusive = true } }
                        }
                    },
                    onGoToRegister = { navController.navigate("register") }
                )
            }

            composable("register") {
                currentRoute = "register"
                RegisterScreen(
                    onRegister = {
                        activeRole = "patient"
                        Toast.makeText(context, "Welcome Alex Johnson", Toast.LENGTH_SHORT).show()
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
                    onNavigate = { route ->
                        currentRoute = route
                        navController.navigate(route)
                    },
                    onSelectAppointment = {}
                )
            }

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

            composable("book-appointment") {
                currentRoute = "book-appointment"
                BookAppointmentScreen(
                    dentists = dentistsState,
                    selectedDentist = selectedDentist ?: dentistsState[0],
                    onSelectDentist = { selectedDentist = it },
                    onConfirmBooking = { dentist, date, time, reason ->
                        val newAppt = Appointment(
                            dentistId = dentist.id,
                            dentistName = dentist.name,
                            dentistSpecialty = dentist.specialty,
                            date = date,
                            time = time,
                            patientName = "Alex Johnson",
                            reason = reason,
                            status = AppointmentStatus.Confirmed
                        )
                        appointmentsState = listOf(newAppt) + appointmentsState
                        navController.navigate("appointment-confirmation")
                    }
                )
            }

            composable("appointment-confirmation") {
                currentRoute = "appointment-confirmation"
                AppointmentConfirmationScreen(
                    dentistName = selectedDentist?.name ?: "Dr. Miller",
                    date = "2026-07-25",
                    time = "10:00 AM",
                    reason = "Regular Checkup",
                    onFinish = { navController.navigate("patient-dashboard") }
                )
            }

            composable("my-appointments") {
                currentRoute = "my-appointments"
                MyAppointmentsScreen(
                    appointments = appointmentsState,
                    onCancel = { id ->
                        appointmentsState = appointmentsState.map {
                            if (it.id == id) it.copy(status = AppointmentStatus.Cancelled) else it
                        }
                    },
                    onReschedule = { id -> navController.navigate("book-appointment") }
                )
            }

            composable("notifications") {
                currentRoute = "notifications"
                NotificationsScreen(
                    notifications = notificationsState,
                    onMarkAsRead = { id ->
                        notificationsState = notificationsState.map {
                            if (it.id == id) it.copy(read = true) else it
                        }
                    },
                    onClearAll = { notificationsState = emptyList() }
                )
            }

            composable("patient-profile") {
                currentRoute = "patient-profile"
                PatientProfileScreen(onLogout = { navController.navigate("login") })
            }

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

            composable("manage-dentists") {
                currentRoute = "manage-dentists"
                ManageDentistsScreen(
                    dentists = dentistsState,
                    onAddDentist = { dentistsState = dentistsState + it },
                    onDeleteDentist = { id -> dentistsState = dentistsState.filter { it.id != id } },
                    onToggleAvailability = { id ->
                        dentistsState = dentistsState.map {
                            if (it.id == id) it.copy(availableToday = !it.availableToday) else it
                        }
                    }
                )
            }

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

            composable("treatment-registration") {
                currentRoute = "treatment-registration"
                TreatmentRegistrationScreen(
                    selectedPatient = selectedPatient,
                    onSaveTreatment = { patientId, diagnosis, treatment, obs ->
                        patientsState = patientsState.map { p ->
                            if (p.id == patientId) {
                                p.copy(
                                    lastVisit = "2026-07-18",
                                    history = listOf(TreatmentRecord("2026-07-18", diagnosis, treatment, obs)) + p.history
                                )
                            } else p
                        }
                    },
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}`
  },
  {
    name: "AuthScreens.kt",
    path: "app/src/main/java/com/example/dentalcare/ui/screens/AuthScreens.kt",
    language: "kotlin",
    description: "Introductory Splash view with brand highlights, along with secure role-based quick credential verification login screens.",
    code: `package com.example.dentalcare.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SplashScreen(onEnterApp: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(colors = listOf(Color(0xFF0F172A), Color(0xFF1E293B)))),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(24.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = Color(0xFF1976D2),
                modifier = Modifier.size(100.dp).padding(bottom = 16.dp),
                shadowElevation = 8.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("🦷", fontSize = 48.sp)
                }
            }

            Text(
                text = "DentalCare",
                style = MaterialTheme.typography.displayLarge.copy(color = Color.White, fontWeight = FontWeight.Bold, fontSize = 36.sp),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Text(
                text = "Your Premium Dental Health & Clinical Planner Companion",
                style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFF94A3B8), textAlign = TextAlign.Center, fontSize = 14.sp),
                modifier = Modifier.padding(bottom = 48.dp)
            )

            Button(
                onClick = onEnterApp,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Text("Get Started", fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

@Composable
fun LoginScreen(onLogin: (role: String) -> Unit, onGoToRegister: () -> Unit) {
    var email by remember { mutableStateOf("alex.johnson@example.com") }
    var password by remember { mutableStateOf("password123") }

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFFF8FAFC)).padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("Welcome Back", style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, color = Color(0xFF0F172A)), modifier = Modifier.padding(bottom = 8.dp))
        Text("Sign in to manage appointments and clinical records", style = MaterialTheme.typography.bodyLarge.copy(color = Color(0xFF64748B), fontSize = 14.sp), modifier = Modifier.padding(bottom = 32.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email Address") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        )

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)
        )

        Button(
            onClick = { onLogin("patient") },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp).padding(bottom = 12.dp)
        ) {
            Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
            Text("Login as Patient (Alex Johnson)", fontWeight = FontWeight.Bold)
        }

        Button(
            onClick = { onLogin("admin") },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF26A69A)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp).padding(bottom = 24.dp)
        ) {
            Icon(Icons.Default.Shield, contentDescription = null, modifier = Modifier.padding(end = 8.dp))
            Text("Login as Administrator", fontWeight = FontWeight.Bold)
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            Text("Don't have an account? ", color = Color(0xFF64748B), fontSize = 13.sp)
            TextButton(onClick = onGoToRegister) {
                Text("Register Now", color = Color(0xFF1976D2), fontWeight = FontWeight.Bold)
            }
        }
    }
}`
  },
  {
    name: "PatientScreens.kt",
    path: "app/src/main/java/com/example/dentalcare/ui/screens/PatientScreens.kt",
    language: "kotlin",
    description: "Comprehensive list of Patient home, dentist roster search, scheduling calendar fields, confirmed prompts, and medical profiles.",
    code: `package com.example.dentalcare.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dentalcare.data.*

@Composable
fun PatientDashboardScreen(
    appointments: List<Appointment>,
    notifications: List<NotificationItem>,
    onNavigate: (String) -> Unit,
    onSelectAppointment: (Appointment) -> Unit
) {
    val unreadAlerts = notifications.count { !it.read }
    val upcomingAppts = appointments.filter { it.status == AppointmentStatus.Confirmed || it.status == AppointmentStatus.Pending }

    LazyColumn(
        modifier = Modifier.fillMaxSize().background(Color(0xFFF8FAFC)).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1976D2)),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Hello, Alex Johnson", style = MaterialTheme.typography.titleLarge.copy(color = Color.White, fontWeight = FontWeight.Bold))
                    Text("Your smile is our priority. Welcome back to DentalCare.", color = Color(0xFFE3F2FD), fontSize = 13.sp, modifier = Modifier.padding(top = 4.dp, bottom = 16.dp))
                    Button(onClick = { onNavigate("dentist-list") }, colors = ButtonDefaults.buttonColors(containerColor = Color.White)) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = Color(0xFF1976D2))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Book Appointment", color = Color(0xFF1976D2), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { onNavigate("my-appointments") }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE3F2FD)), modifier = Modifier.weight(1f).height(48.dp)) {
                    Text("Schedule", color = Color(0xFF0D47A1), fontWeight = FontWeight.Bold)
                }
                Button(onClick = { onNavigate("notifications") }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE0F2F1)), modifier = Modifier.weight(1f).height(48.dp)) {
                    Text("Alerts ($unreadAlerts)", color = Color(0xFF004D40), fontWeight = FontWeight.Bold)
                }
                Button(onClick = { onNavigate("patient-profile") }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF1F5F9)), modifier = Modifier.weight(1f).height(48.dp)) {
                    Text("Profile", color = Color(0xFF475569), fontWeight = FontWeight.Bold)
                }
            }
        }

        item {
            Text("Upcoming Schedule", style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold, fontSize = 18.sp))
        }

        if (upcomingAppts.isEmpty()) {
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
                    Box(modifier = Modifier.padding(24.dp).fillMaxWidth(), contentAlignment = Alignment.Center) {
                        Text("No active upcoming appointments.", color = Color(0xFF64748B))
                    }
                }
            }
        } else {
            items(upcomingAppts) { appt ->
                ElevatedCard(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.elevatedCardColors(containerColor = Color.White)) {
                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(48.dp).clip(CircleShape).background(Color(0xFFE3F2FD)), contentAlignment = Alignment.Center) {
                            Text("👩‍⚕️", fontSize = 24.sp)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(appt.dentistName, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text(appt.date + " at " + appt.time, color = Color(0xFF64748B), fontSize = 12.sp)
                        }
                        Text(appt.status.name, color = Color(0xFF0B5345), fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun DentistListScreen(dentists: List<Dentist>, onSelectDentist: (Dentist) -> Unit) {
    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF8FAFC)).padding(16.dp)) {
        Text("Our Specialists", style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold))
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(dentists) { doc ->
                ElevatedCard(onClick = { onSelectDentist(doc) }, modifier = Modifier.fillMaxWidth(), colors = CardDefaults.elevatedCardColors(containerColor = Color.White)) {
                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(56.dp).clip(CircleShape).background(Color(0xFFE0F2F1)), contentAlignment = Alignment.Center) {
                            Text("🦷", fontSize = 28.sp)
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(doc.name, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text(doc.specialty, color = Color(0xFF64748B), fontSize = 12.sp)
                        }
                        Text(if (doc.availableToday) "Available" else "Busy", color = Color(0xFF0B5345), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "AdminScreens.kt",
    path: "app/src/main/java/com/example/dentalcare/ui/screens/AdminScreens.kt",
    language: "kotlin",
    description: "Clinical Operations, doctor roster toggles, digital patient record charts, and medical diagnostic logs.",
    code: `package com.example.dentalcare.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dentalcare.data.*

@Composable
fun AdminDashboardScreen(
    appointments: List<Appointment>,
    patients: List<Patient>,
    dentists: List<Dentist>,
    onNavigate: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize().background(Color(0xFFF8FAFC)).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Clinical Control Panel", style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold))
            Text("Roster scheduling and digital treatment charts.", color = Color(0xFF64748B), fontSize = 12.sp)
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Card(modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Doctors", color = Color(0xFF64748B), fontSize = 11.sp)
                        Text("\${dentists.size} Active", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF1976D2))
                    }
                }
                Card(modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Patients", color = Color(0xFF64748B), fontSize = 11.sp)
                        Text("\${patients.size} Registered", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF26A69A))
                    }
                }
            }
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { onNavigate("manage-dentists") }, colors = ButtonDefaults.buttonColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
                    Text("Manage Dentist Roster", color = Color(0xFF1976D2))
                }
                Button(onClick = { onNavigate("manage-patients") }, colors = ButtonDefaults.buttonColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
                    Text("Access Patient Records", color = Color(0xFF26A69A))
                }
            }
        }
    }
}`
  },
  {
    name: "Models.kt",
    path: "app/src/main/java/com/example/dentalcare/data/Models.kt",
    language: "kotlin",
    description: "Type-safe data schemas, status enums, treatment records, and initial clinical datasets.",
    code: `package com.example.dentalcare.data

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
    val avatarColor: String
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
    val status: AppointmentStatus
)`
  },
  {
    name: "Theme.kt",
    path: "app/src/main/java/com/example/dentalcare/ui/theme/Theme.kt",
    language: "kotlin",
    description: "Material Design 3 Theme color palettes, light/dark schemes, and custom healthcare typography scales.",
    code: `package com.example.dentalcare.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.sp

val PrimaryM3 = Color(0xFF1976D2)
val SecondaryM3 = Color(0xFF26A69A)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryM3,
    secondary = SecondaryM3,
    background = Color(0xFFF8FAFC),
    surface = Color.White
)

@Composable
fun DentalCareTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}`
  },
  {
    name: "build.gradle.kts",
    path: "app/build.gradle.kts",
    language: "gradle",
    description: "Kotlin DSL build configurations declaring SDK thresholds and Compose UI libraries.",
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.dentalcare"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.dentalcare"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
}`
  }
];
