package com.example.dentalcare.ui.screens

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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dentalcare.data.Appointment
import com.example.dentalcare.data.AppointmentStatus
import com.example.dentalcare.data.Dentist
import com.example.dentalcare.data.NotificationItem
import com.example.dentalcare.data.NotificationType

import com.example.dentalcare.data.AuthRepository

// ==========================================
// 1. PATIENT DASHBOARD VIEW
// ==========================================
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
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1976D2)),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        "Hello, Alex Johnson",
                        style = MaterialTheme.typography.titleLarge.copy(color = Color.White, fontWeight = FontWeight.Bold)
                    )
                    Text(
                        "Your smile is our absolute priority. Welcome back to DentalCare clinical companion.",
                        color = Color(0xFFE3F2FD),
                        fontSize = 13.sp,
                        modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
                    )

                    Button(
                        onClick = { onNavigate("dentist-list") },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = Color(0xFF1976D2))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Book New Appointment", color = Color(0xFF1976D2), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Fast Actions Grid Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { onNavigate("my-appointments") },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE3F2FD)),
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color(0xFF0D47A1))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Schedule", color = Color(0xFF0D47A1), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = { onNavigate("notifications") },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE0F2F1)),
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    BadgedBox(badge = {
                        if (unreadAlerts > 0) {
                            Badge(containerColor = Color(0xFFF44336)) {
                                Text(unreadAlerts.toString(), color = Color.White)
                            }
                        }
                    }) {
                        Icon(Icons.Default.Notifications, contentDescription = null, tint = Color(0xFF004D40))
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Alerts", color = Color(0xFF004D40), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = { onNavigate("patient-profile") },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF1F5F9)),
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.AccountCircle, contentDescription = null, tint = Color(0xFF475569))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Profile", color = Color(0xFF475569), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Upcoming Appointment Section
        item {
            Text(
                "Upcoming Schedule",
                style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold, fontSize = 18.sp),
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        if (upcomingAppts.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp).fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("📅", fontSize = 36.sp)
                        Text(
                            "No active upcoming appointments found.",
                            color = Color(0xFF64748B),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }
        } else {
            items(upcomingAppts) { appt ->
                ElevatedCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            onSelectAppointment(appt)
                            onNavigate("my-appointments")
                        },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.elevatedCardColors(containerColor = Color.White)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFE3F2FD)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("👨‍⚕️", fontSize = 24.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(appt.dentistName, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text(appt.dentistSpecialty, color = Color(0xFF64748B), fontSize = 12.sp)
                            
                            Row(
                                modifier = Modifier.padding(top = 8.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                SuggestionChip(
                                    onClick = {},
                                    label = { Text(appt.date, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                                    icon = { Icon(Icons.Default.DateRange, contentDescription = null, modifier = Modifier.size(12.dp)) }
                                )
                                SuggestionChip(
                                    onClick = {},
                                    label = { Text(appt.time, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                                    icon = { Icon(Icons.Default.AccessTime, contentDescription = null, modifier = Modifier.size(12.dp)) }
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (appt.status == AppointmentStatus.Confirmed) Color(0xFFD1F2EB) else Color(0xFFFEF5E7),
                            modifier = Modifier.padding(start = 4.dp)
                        ) {
                            Text(
                                text = appt.status.name,
                                color = if (appt.status == AppointmentStatus.Confirmed) Color(0xFF0B5345) else Color(0xFF7E5109),
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 2. DENTIST ROSTER VIEW
// ==========================================
@Composable
fun DentistListScreen(
    dentists: List<Dentist>,
    onSelectDentist: (Dentist) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Text(
            "Select Clinical Dentist",
            style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
        )
        Text(
            "Our certified team of world-class specialists is ready to provide state-of-the-art care.",
            color = Color(0xFF64748B),
            fontSize = 12.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(dentists) { doc ->
                ElevatedCard(
                    onClick = { onSelectDentist(doc) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.elevatedCardColors(containerColor = Color.White)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFE0F2F1)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(if (doc.name.contains("Sarah")) "👩‍⚕️" else "👨‍⚕️", fontSize = 28.sp)
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                doc.name,
                                style = MaterialTheme.typography.titleLarge.copy(fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            )
                            Text(
                                doc.specialty,
                                color = Color(0xFF64748B),
                                fontSize = 12.sp
                            )
                            
                            Row(
                                modifier = Modifier.padding(top = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFFFC107), modifier = Modifier.size(14.dp))
                                Text(
                                    " ${doc.rating} (${doc.reviewsCount} reviews)",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF475569)
                                )
                            }
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (doc.availableToday) Color(0xFFD1F2EB) else Color(0xFFFADBD8),
                                modifier = Modifier.padding(bottom = 8.dp)
                            ) {
                                Text(
                                    text = if (doc.availableToday) "Available" else "Booked",
                                    color = if (doc.availableToday) Color(0xFF0B5345) else Color(0xFF7B241C),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }

                            Icon(
                                Icons.Default.ArrowForwardIos,
                                contentDescription = null,
                                tint = Color(0xFFCBD5E1),
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 3. BOOK APPOINTMENT VIEW
// ==========================================
@Composable
fun BookAppointmentScreen(
    dentists: List<Dentist>,
    selectedDentist: Dentist?,
    onSelectDentist: (Dentist) -> Unit,
    onConfirmBooking: (dentist: Dentist, date: String, time: String, reason: String) -> Unit
) {
    var selectedDate by remember { mutableStateOf("2026-07-25") }
    var selectedTime by remember { mutableStateOf("10:00 AM") }
    var reason by remember { mutableStateOf("") }

    val times = listOf(
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                "Configure Booking Details",
                style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
            )
        }

        // Dentist Selection Preview
        selectedDentist?.let { doc ->
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFE3F2FD)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("🦷", fontSize = 22.sp)
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(doc.name, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text(doc.specialty, color = Color(0xFF64748B), fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Date Picker field
        item {
            OutlinedTextField(
                value = selectedDate,
                onValueChange = { selectedDate = it },
                label = { Text("Clinical Date (YYYY-MM-DD)") },
                leadingIcon = { Icon(Icons.Default.DateRange, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF1976D2),
                    unfocusedBorderColor = Color(0xFFCBD5E1)
                )
            )
        }

        // Time Slot Row Title
        item {
            Text("Select Available Hour", fontWeight = FontWeight.Bold, color = Color(0xFF475569))
        }

        // Time Slots Wrap/Grid
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                val chunkedTimes = times.chunked(3)
                chunkedTimes.forEach { rowTimes ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        rowTimes.forEach { t ->
                            val isSelected = selectedTime == t
                            Button(
                                onClick = { selectedTime = t },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isSelected) Color(0xFF1976D2) else Color.White
                                ),
                                border = if (isSelected) null else CardDefaults.outlinedCardBorder(),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f).height(40.dp)
                            ) {
                                Text(
                                    t,
                                    color = if (isSelected) Color.White else Color(0xFF475569),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }

        // Reason field
        item {
            OutlinedTextField(
                value = reason,
                onValueChange = { reason = it },
                label = { Text("Reason for Dental Visit") },
                placeholder = { Text("e.g. Regular scaling, brackets checkup, dental pain") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF1976D2),
                    unfocusedBorderColor = Color(0xFFCBD5E1)
                )
            )
        }

        // Confirmation Action Button
        item {
            Button(
                onClick = {
                    if (selectedDentist != null) {
                        onConfirmBooking(
                            selectedDentist,
                            selectedDate,
                            selectedTime,
                            reason.ifEmpty { "General Consult" }
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text("Confirm & Book Appointment", fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

// ==========================================
// 4. APPOINTMENT CONFIRMATION VIEW
// ==========================================
@Composable
fun AppointmentConfirmationScreen(
    dentistName: String,
    date: String,
    time: String,
    reason: String,
    onFinish: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Surface(
            shape = CircleShape,
            color = Color(0xFFD1F2EB),
            modifier = Modifier.size(80.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    Icons.Default.Check,
                    contentDescription = null,
                    tint = Color(0xFF0B5345),
                    modifier = Modifier.size(40.dp)
                )
            }
        }

        Text(
            "Booking Successfully Confirmed!",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A),
                textAlign = TextAlign.Center
            ),
            modifier = Modifier.padding(top = 24.dp, bottom = 8.dp)
        )

        Text(
            "Your appointment has been registered in our database system.",
            color = Color(0xFF64748B),
            fontSize = 13.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 32.dp)
        )

        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = CardDefaults.outlinedCardBorder(),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().padding(bottom = 32.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Dentist", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text(dentistName, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 13.sp)
                }
                HorizontalDivider(color = Color(0xFFF1F5F9))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Date", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text(date, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 13.sp)
                }
                HorizontalDivider(color = Color(0xFFF1F5F9))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Time", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text(time, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 13.sp)
                }
                HorizontalDivider(color = Color(0xFFF1F5F9))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Reason", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text(reason, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 13.sp)
                }
            }
        }

        Button(
            onClick = onFinish,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Text("Back to Dashboard", fontWeight = FontWeight.Bold)
        }
    }
}

// ==========================================
// 5. APPOINTMENTS SCHEDULE VIEW
// ==========================================
@Composable
fun MyAppointmentsScreen(
    appointments: List<Appointment>,
    onCancel: (String) -> Unit,
    onReschedule: (String) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) } // 0 = Upcoming, 1 = History

    val filteredAppts = appointments.filter { appt ->
        if (selectedTab == 0) {
            appt.status == AppointmentStatus.Confirmed || appt.status == AppointmentStatus.Pending
        } else {
            appt.status == AppointmentStatus.Completed || appt.status == AppointmentStatus.Cancelled
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Text(
            "Your Appointments",
            style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
        )
        Text(
            "Track, cancel or reschedule dental treatments.",
            color = Color(0xFF64748B),
            fontSize = 12.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = Color.Transparent,
            modifier = Modifier.padding(bottom = 16.dp)
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Active") }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Past & Cancelled") }
            )
        }

        if (filteredAppts.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("📅", fontSize = 48.sp)
                    Text("No appointments registered in this tab.", color = Color(0xFF64748B), modifier = Modifier.padding(top = 8.dp))
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredAppts) { appt ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = CardDefaults.outlinedCardBorder(),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFFE3F2FD)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("👨‍⚕️", fontSize = 20.sp)
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(appt.dentistName, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                                    Text(appt.dentistSpecialty, color = Color(0xFF64748B), fontSize = 11.sp)
                                }
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = when (appt.status) {
                                        AppointmentStatus.Confirmed -> Color(0xFFD1F2EB)
                                        AppointmentStatus.Pending -> Color(0xFFFEF5E7)
                                        AppointmentStatus.Completed -> Color(0xFFE8F6F3)
                                        AppointmentStatus.Cancelled -> Color(0xFFFADBD8)
                                    }
                                ) {
                                    Text(
                                        appt.status.name,
                                        color = when (appt.status) {
                                            AppointmentStatus.Confirmed -> Color(0xFF0B5345)
                                            AppointmentStatus.Pending -> Color(0xFF7E5109)
                                            AppointmentStatus.Completed -> Color(0xFF1B4F72)
                                            AppointmentStatus.Cancelled -> Color(0xFF7B241C)
                                        },
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0xFFF1F5F9))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.DateRange, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(appt.date, color = Color(0xFF475569), fontSize = 12.sp)
                                }
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.AccessTime, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(appt.time, color = Color(0xFF475569), fontSize = 12.sp)
                                }
                            }

                            if (appt.reason.isNotEmpty()) {
                                Text(
                                    "Reason: ${appt.reason}",
                                    fontSize = 12.sp,
                                    color = Color(0xFF64748B),
                                    modifier = Modifier.padding(top = 8.dp)
                                )
                            }

                            // Treatment Summary if completed
                            if (appt.status == AppointmentStatus.Completed && appt.treatment != null) {
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
                                    modifier = Modifier.padding(top = 12.dp).fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text("⚕️ Diagnosis & Treatment", fontWeight = FontWeight.Bold, color = Color(0xFF166534), fontSize = 12.sp)
                                        Text(appt.treatment!!, color = Color(0xFF15803D), fontSize = 11.sp)
                                        appt.observations?.let {
                                            Text(it, color = Color(0xFF166534), fontSize = 10.sp, modifier = Modifier.padding(top = 4.dp))
                                        }
                                    }
                                }
                            }

                            // Actions if Upcoming/Pending
                            if (selectedTab == 0) {
                                Row(
                                    modifier = Modifier.padding(top = 16.dp).fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedButton(
                                        onClick = { onCancel(appt.id) },
                                        shape = RoundedCornerShape(8.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFF44336)),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Cancel", fontSize = 12.sp)
                                    }

                                    Button(
                                        onClick = { onReschedule(appt.id) },
                                        shape = RoundedCornerShape(8.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Reschedule", fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 6. CLINICAL ALERTS VIEW
// ==========================================
@Composable
fun NotificationsScreen(
    notifications: List<NotificationItem>,
    onMarkAsRead: (String) -> Unit,
    onClearAll: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Clinical Notifications",
                style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
            )
            if (notifications.isNotEmpty()) {
                TextButton(onClick = onClearAll) {
                    Text("Clear All", color = Color(0xFFF44336), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }

        if (notifications.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🔔", fontSize = 48.sp)
                    Text("Your inbox is clean!", color = Color(0xFF64748B), modifier = Modifier.padding(top = 8.dp))
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(notifications) { notif ->
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (notif.read) Color.White else Color(0xFFF1F5F9)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onMarkAsRead(notif.id) },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when (notif.type) {
                                            NotificationType.CONFIRMED -> Color(0xFFD1F2EB)
                                            NotificationType.REMINDER -> Color(0xFFFEF5E7)
                                            NotificationType.UPDATED -> Color(0xFFE3F2FD)
                                            NotificationType.CANCELLED -> Color(0xFFFADBD8)
                                        }
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (notif.type) {
                                        NotificationType.CONFIRMED -> Icons.Default.Check
                                        NotificationType.REMINDER -> Icons.Default.Notifications
                                        NotificationType.UPDATED -> Icons.Default.Edit
                                        NotificationType.CANCELLED -> Icons.Default.Close
                                    },
                                    contentDescription = null,
                                    tint = when (notif.type) {
                                        NotificationType.CONFIRMED -> Color(0xFF0B5345)
                                        NotificationType.REMINDER -> Color(0xFF7E5109)
                                        NotificationType.UPDATED -> Color(0xFF0D47A1)
                                        NotificationType.CANCELLED -> Color(0xFF7B241C)
                                    },
                                    modifier = Modifier.size(18.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    notif.title,
                                    fontWeight = if (notif.read) FontWeight.Medium else FontWeight.Bold,
                                    color = Color(0xFF0F172A),
                                    fontSize = 13.sp
                                )
                                Text(
                                    notif.message,
                                    color = Color(0xFF64748B),
                                    fontSize = 11.sp,
                                    lineHeight = 14.sp,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                                Text(
                                    notif.time,
                                    color = Color(0xFF94A3B8),
                                    fontSize = 10.sp,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 7. PATIENT PROFILE VIEW
// ==========================================
@Composable
fun PatientProfileScreen(onLogout: () -> Unit) {
    val authRepository = remember { AuthRepository() }
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Avatar Frame
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(Color(0xFF1976D2)),
            contentAlignment = Alignment.Center
        ) {
            Text("AJ", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
        }

        Text(
            "Alex Johnson",
            style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(top = 12.dp)
        )
        Text(
            authRepository.currentUser?.email ?: "alex.johnson@example.com",
            color = Color(0xFF64748B),
            fontSize = 12.sp,
            modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
        )

        // Health Ratios Summary Grid
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🦷 Restoration", color = Color(0xFF64748B), fontSize = 11.sp)
                    Text("1 Filling", fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 14.sp)
                }
            }
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("✨ Plaque Index", color = Color(0xFF64748B), fontSize = 11.sp)
                    Text("Optimal", fontWeight = FontWeight.Bold, color = Color(0xFF26A69A), fontSize = 14.sp)
                }
            }
        }

        // Diagnostic information cards
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().padding(bottom = 32.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.HealthAndSafety, contentDescription = null, tint = Color(0xFF1976D2))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Clinical Registration Data", fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Registered Since", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text("2025-10-15", fontWeight = FontWeight.SemiBold, color = Color(0xFF0F172A), fontSize = 12.sp)
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Last Scaling Care", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text("2026-04-12", fontWeight = FontWeight.SemiBold, color = Color(0xFF0F172A), fontSize = 12.sp)
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Medical Conditions", color = Color(0xFF64748B), fontSize = 12.sp)
                    Text("None declared", fontWeight = FontWeight.SemiBold, color = Color(0xFF0F172A), fontSize = 12.sp)
                }
            }
        }

        Button(
            onClick = {
                authRepository.logout()
                onLogout()
            },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFADBD8)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Icon(Icons.Default.Logout, contentDescription = null, tint = Color(0xFF7B241C))
            Spacer(modifier = Modifier.width(8.dp))
            Text("Log Out securely", color = Color(0xFF7B241C), fontWeight = FontWeight.Bold)
        }
    }
}
