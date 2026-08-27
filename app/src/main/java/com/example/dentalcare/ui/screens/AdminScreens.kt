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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.dentalcare.data.Appointment
import com.example.dentalcare.data.AppointmentStatus
import com.example.dentalcare.data.Dentist
import com.example.dentalcare.data.Patient

// ==========================================
// 1. ADMIN DASHBOARD VIEW
// ==========================================
@Composable
fun AdminDashboardScreen(
    appointments: List<Appointment>,
    patients: List<Patient>,
    dentists: List<Dentist>,
    onNavigate: (String) -> Unit
) {
    val totalAppts = appointments.size
    val totalPatients = patients.size
    val activeDoctors = dentists.count { it.availableToday }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                "Clinical Control Panel",
                style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
            )
            Text(
                "Roster scheduling, digital dental charts, and billing pipelines.",
                color = Color(0xFF64748B),
                fontSize = 12.sp
            )
        }

        // Numerical Metrics Rows
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Roster Dentists", color = Color(0xFF64748B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("${dentists.size} ($activeDoctors active)", color = Color(0xFF1976D2), fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.padding(top = 4.dp))
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Active Patients", color = Color(0xFF64748B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("$totalPatients registered", color = Color(0xFF26A69A), fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.padding(top = 4.dp))
                    }
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text("Total Scheduled", color = Color(0xFF64748B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("$totalAppts appointments registered", color = Color(0xFF0F172A), fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.padding(top = 4.dp))
                }
            }
        }

        // Administrative Core Actions Title
        item {
            Text(
                "Roster Operations",
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A),
                fontSize = 16.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        // Administrative Buttons
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                // Button A: Doctors
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigate("manage-dentists") }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFFE3F2FD)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.MedicalServices, contentDescription = null, tint = Color(0xFF1976D2))
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Roster Management", fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text("Add, remove or edit dentist schedules and availability.", color = Color(0xFF64748B), fontSize = 11.sp)
                        }
                        Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color(0xFFCBD5E1))
                    }
                }

                // Button B: Patients
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigate("manage-patients") }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFFE0F2F1)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.People, contentDescription = null, tint = Color(0xFF26A69A))
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Patient Records & History", fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text("Consult diagnoses, observations and register new treatments.", color = Color(0xFF64748B), fontSize = 11.sp)
                        }
                        Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color(0xFFCBD5E1))
                    }
                }

                // Button C: Appointment Management
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigate("appointment-management") }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFFF1F5F9)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color(0xFF475569))
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Schedule Management", fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                            Text("Change status (confirmed, pending, cancelled) or book for patients.", color = Color(0xFF64748B), fontSize = 11.sp)
                        }
                        Icon(Icons.Default.ArrowForward, contentDescription = null, tint = Color(0xFFCBD5E1))
                    }
                }
            }
        }
    }
}

// ==========================================
// 2. MANAGE DENTISTS VIEW
// ==========================================
@Composable
fun ManageDentistsScreen(
    dentists: List<Dentist>,
    onAddDentist: (newDoc: Dentist) -> Unit,
    onDeleteDentist: (id: String) -> Unit,
    onToggleAvailability: (id: String) -> Unit
) {
    var showForm by remember { mutableStateOf(false) }
    var name by remember { mutableStateOf("") }
    var specialty by remember { mutableStateOf("") }

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
                "Clinical Roster",
                style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
            )
            Button(
                onClick = { showForm = !showForm },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(if (showForm) Icons.Default.Close else Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(if (showForm) "Close" else "Add Doctor", fontSize = 12.sp)
            }
        }

        if (showForm) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = CardDefaults.outlinedCardBorder(),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Register New Dentist", fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                    
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Full Name (e.g., Dr. Alice Stone)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF1976D2),
                            unfocusedBorderColor = Color(0xFFCBD5E1)
                        )
                    )

                    OutlinedTextField(
                        value = specialty,
                        onValueChange = { specialty = it },
                        label = { Text("Dental Specialty") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF1976D2),
                            unfocusedBorderColor = Color(0xFFCBD5E1)
                        )
                    )

                    Button(
                        onClick = {
                            if (name.isNotEmpty() && specialty.isNotEmpty()) {
                                onAddDentist(
                                    Dentist(
                                        name = name,
                                        specialty = specialty,
                                        rating = 5.0,
                                        reviewsCount = 0,
                                        availableToday = true,
                                        avatarColor = "Primary"
                                    )
                                )
                                name = ""
                                specialty = ""
                                showForm = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Save to Clinical Roster")
                    }
                }
            }
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(dentists) { doc ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFFE3F2FD)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("👩‍⚕️", fontSize = 20.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(doc.name, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A), fontSize = 13.sp)
                            Text(doc.specialty, color = Color(0xFF64748B), fontSize = 11.sp)
                            
                            Row(
                                modifier = Modifier.padding(top = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Available Today: ", fontSize = 11.sp, color = Color(0xFF64748B))
                                Switch(
                                    checked = doc.availableToday,
                                    onCheckedChange = { onToggleAvailability(doc.id) },
                                    modifier = Modifier.scale(0.7f)
                                )
                            }
                        }

                        IconButton(onClick = { onDeleteDentist(doc.id) }) {
                            Icon(Icons.Default.Delete, contentDescription = null, tint = Color(0xFFF44336))
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 3. MANAGE PATIENTS VIEW
// ==========================================
@Composable
fun ManagePatientsScreen(
    patients: List<Patient>,
    onSelectPatient: (Patient) -> Unit,
    onNavigate: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Text(
            "Registered Patients",
            style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
        )
        Text(
            "Select a patient below to view full clinical details and append new dental treatments.",
            color = Color(0xFF64748B),
            fontSize = 12.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(patients) { p ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder(),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().clickable {
                        onSelectPatient(p)
                        onNavigate("treatment-registration")
                    }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFFE0F2F1)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("👤", fontSize = 20.sp)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(p.name, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                                Text(p.email, color = Color(0xFF64748B), fontSize = 11.sp)
                            }
                            Icon(Icons.Default.MedicalServices, contentDescription = null, tint = Color(0xFF26A69A))
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0xFFF1F5F9))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Last visit date: ${p.lastVisit}", color = Color(0xFF64748B), fontSize = 11.sp)
                            Text("${p.history.size} records found", color = Color(0xFF26A69A), fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 4. TREATMENT REGISTRATION (Dental Charts)
// ==========================================
@Composable
fun TreatmentRegistrationScreen(
    selectedPatient: Patient?,
    onSaveTreatment: (patientId: String, diagnosis: String, treatment: String, observations: String) -> Unit,
    onBack: () -> Unit
) {
    var diagnosis by remember { mutableStateOf("") }
    var treatment by remember { mutableStateOf("") }
    var observations by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        if (selectedPatient == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No patient selected. Please return and select a patient.", color = Color(0xFF64748B))
            }
        } else {
            Text(
                "Write Dental Treatment Record",
                style = MaterialTheme.typography.titleLarge.copy(color = Color(0xFF0F172A), fontWeight = FontWeight.Bold)
            )
            Text(
                "Patient: ${selectedPatient.name}",
                color = Color(0xFF26A69A),
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                item {
                    OutlinedTextField(
                        value = diagnosis,
                        onValueChange = { diagnosis = it },
                        label = { Text("Clinical Diagnosis") },
                        placeholder = { Text("e.g. Mild caries on tooth 37, dental calculus") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF26A69A),
                            unfocusedBorderColor = Color(0xFFCBD5E1)
                        )
                    )
                }

                item {
                    OutlinedTextField(
                        value = treatment,
                        onValueChange = { treatment = it },
                        label = { Text("Applied Dental Treatment") },
                        placeholder = { Text("e.g. Scaling & Prophylaxis, Composite Restoration Tooth 37") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF26A69A),
                            unfocusedBorderColor = Color(0xFFCBD5E1)
                        )
                    )
                }

                item {
                    OutlinedTextField(
                        value = observations,
                        onValueChange = { observations = it },
                        label = { Text("Special Medical Observations") },
                        placeholder = { Text("e.g. Advised patient to avoid cold drinks, reschedule check-up in 6 months") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF26A69A),
                            unfocusedBorderColor = Color(0xFFCBD5E1)
                        )
                    )
                }

                item {
                    Button(
                        onClick = {
                            if (diagnosis.isNotEmpty() && treatment.isNotEmpty()) {
                                onSaveTreatment(selectedPatient.id, diagnosis, treatment, observations)
                                diagnosis = ""
                                treatment = ""
                                observations = ""
                                onBack()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF26A69A)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("Publish Clinical Record", fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }

                item {
                    Text(
                        "Clinical Treatment Logs (${selectedPatient.name})",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F172A),
                        fontSize = 14.sp,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }

                if (selectedPatient.history.isEmpty()) {
                    item {
                        Text("No historical records on file.", color = Color(0xFF64748B), fontSize = 12.sp)
                    }
                } else {
                    items(selectedPatient.history) { record ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            border = CardDefaults.outlinedCardBorder(),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(record.date, fontWeight = FontWeight.Bold, color = Color(0xFF1976D2), fontSize = 11.sp)
                                    Text("Approved", color = Color(0xFF26A69A), fontWeight = FontWeight.Bold, fontSize = 10.sp)
                                }
                                Text("Diagnosis: ${record.diagnosis}", color = Color(0xFF0F172A), fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                                Text("Treatment: ${record.treatment}", color = Color(0xFF475569), fontSize = 12.sp, modifier = Modifier.padding(top = 2.dp))
                                if (record.observations.isNotEmpty()) {
                                    Text("Observations: ${record.observations}", color = Color(0xFF64748B), fontSize = 11.sp, modifier = Modifier.padding(top = 4.dp))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
// Helper modifier scale extension for switch
fun Modifier.scale(scale: Float): Modifier = this
