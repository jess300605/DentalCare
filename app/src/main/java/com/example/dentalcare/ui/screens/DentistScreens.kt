package com.example.dentalcare.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dentalcare.data.Appointment
import com.example.dentalcare.data.AppointmentStatus

// ==========================================
// DENTIST DASHBOARD — a dentist's own schedule.
// Only ever shows appointments where dentistId matches THIS dentist —
// that filtering already happened in the Firestore query / security rules
// (see FirestoreRepository.observeAppointmentsForDentist), this screen
// just renders whatever list it's handed.
// ==========================================
@Composable
fun DentistDashboardScreen(
    dentistName: String,
    isLinked: Boolean,
    appointments: List<Appointment>,
    onUpdateStatus: (id: String, status: AppointmentStatus) -> Unit,
    onAddTreatment: (appointment: Appointment) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Text(
            if (dentistName.isNotBlank()) "Welcome, Dr. $dentistName" else "Welcome",
            style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
        )
        Text(
            "Here is your full appointment schedule.",
            color = Color(0xFF64748B),
            fontSize = 12.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        if (!isLinked) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF3E0)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "Your account doesn't have a dentist profile linked yet. Ask an admin to set your dentistId in Firestore so you can see your schedule.",
                    color = Color(0xFF7A4A00),
                    fontSize = 12.sp,
                    modifier = Modifier.padding(14.dp)
                )
            }
            return@Column
        }

        val sorted = appointments.sortedWith(compareBy({ it.date }, { it.time }))

        if (sorted.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No appointments assigned to you yet.", color = Color(0xFF64748B))
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(sorted) { appt ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = CardDefaults.outlinedCardBorder(),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(appt.patientName, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 13.sp)
                                Text(
                                    appt.status.name,
                                    color = dentistStatusColor(appt.status),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            }
                            Text(
                                "${appt.date} · ${appt.time}",
                                color = Color(0xFF475569),
                                fontSize = 11.sp,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                            Text(
                                "Reason: ${appt.reason}",
                                color = Color(0xFF64748B),
                                fontSize = 11.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                AppointmentStatus.values().forEach { statusOption ->
                                    FilterChip(
                                        selected = appt.status == statusOption,
                                        onClick = { onUpdateStatus(appt.id, statusOption) },
                                        label = { Text(statusOption.name, fontSize = 10.sp) }
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            OutlinedButton(
                                onClick = { onAddTreatment(appt) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Add Treatment Notes", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun dentistStatusColor(status: AppointmentStatus): Color = when (status) {
    AppointmentStatus.Confirmed -> Color(0xFF26A69A)
    AppointmentStatus.Pending -> Color(0xFFFFA000)
    AppointmentStatus.Completed -> Color(0xFF1976D2)
    AppointmentStatus.Cancelled -> Color(0xFFF44336)
}
