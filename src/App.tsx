/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ActiveScreen, 
  Dentist, 
  Patient, 
  Appointment, 
  NotificationItem, 
  AppointmentStatus,
  AuthUser
} from './types';
import { 
  INITIAL_DENTISTS, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS
} from './data';
import { AndroidFrame } from './components/AndroidFrame';
import { DesignSystemPanel } from './components/DesignSystemPanel';
import {
  SplashScreenView,
  LoginScreenView,
  RegisterScreenView,
  PatientDashboardView,
  DentistListView,
  BookAppointmentView,
  AppointmentConfirmationView,
  MyAppointmentsView,
  NotificationsView,
  PatientProfileView,
  AdminDashboardView,
  ManageDentistsView,
  ManagePatientsView,
  AppointmentManagementView,
  TreatmentRegistrationView
} from './components/AndroidScreens';
import { 
  HelpCircle, 
  Smartphone, 
  Monitor, 
  Settings, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Terminal,
  LogOut,
  UserCheck
} from 'lucide-react';

export default function App() {
  // --- Global Application States ---
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('splash');
  const [userRole, setUserRole] = useState<'patient' | 'admin'>('patient');
  
  // Registered Auth Users state with persistence
  const [users, setUsers] = useState<AuthUser[]>(() => {
    try {
      const stored = localStorage.getItem('dentalcare_users');
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Currently logged-in user
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('dentalcare_current_user');
      return stored ? JSON.parse(stored) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });
  
  const [dentists, setDentists] = useState<Dentist[]>(() => {
    try {
      const stored = localStorage.getItem('dentalcare_dentists');
      return stored ? JSON.parse(stored) : INITIAL_DENTISTS;
    } catch {
      return INITIAL_DENTISTS;
    }
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem('dentalcare_patients');
      return stored ? JSON.parse(stored) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem('dentalcare_appointments');
      return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('dentalcare_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_users', JSON.stringify(users));
    } catch { /* no-op */ }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('dentalcare_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('dentalcare_current_user');
      }
    } catch { /* no-op */ }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_appointments', JSON.stringify(appointments));
    } catch { /* no-op */ }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_notifications', JSON.stringify(notifications));
    } catch { /* no-op */ }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_dentists', JSON.stringify(dentists));
    } catch { /* no-op */ }
  }, [dentists]);

  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_patients', JSON.stringify(patients));
    } catch { /* no-op */ }
  }, [patients]);

  // --- Context Selection States ---
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || INITIAL_PATIENTS[0]);
  const [lastBooking, setLastBooking] = useState<{
    dentist: Dentist;
    date: string;
    time: string;
    reason: string;
  } | null>(null);

  // --- Toast/Alert States ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- Navigation & Routing Hooks ---
  const handleNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    // Reset selection contexts appropriately
    if (screen === 'book-appointment' && !selectedDentist) {
      setSelectedDentist(dentists[0]);
    }
  };

  // --- Authentication Event Handlers ---
  const handleLogin = (role: 'patient' | 'admin', user?: AuthUser) => {
    setUserRole(role);
    const resolvedUser = user || (role === 'admin' ? users.find(u => u.role === 'admin') || INITIAL_USERS[2] : users.find(u => u.role === 'patient') || INITIAL_USERS[0]);
    setCurrentUser(resolvedUser);
    
    showToast(`Successfully logged in as ${resolvedUser.name} (${role === 'admin' ? 'Clinic Administrator' : 'Patient'})`);
    
    if (role === 'admin') {
      setActiveScreen('admin-dashboard');
    } else {
      setActiveScreen('patient-dashboard');
    }
  };

  const handleRegister = (newUser: AuthUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setUserRole(newUser.role);

    // If registered as patient, ensure they appear in the clinical patient registry
    if (newUser.role === 'patient') {
      const newPatientRecord: Patient = {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        lastVisit: 'First Consultation',
        history: []
      };
      setPatients((prev) => [newPatientRecord, ...prev]);
    }

    // Add welcome notification
    const welcomeNotif: NotificationItem = {
      id: 'n_welcome_' + Date.now(),
      type: 'confirmed',
      title: 'Welcome to DentalCare!',
      message: `Hello ${newUser.name}, your account is active. You can now book appointments with our specialist dentists.`,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    showToast(`Account created! Welcome to DentalCare, ${newUser.name}.`);
    
    if (newUser.role === 'admin') {
      setActiveScreen('admin-dashboard');
    } else {
      setActiveScreen('patient-dashboard');
    }
  };

  const handleUpdateProfile = (updated: Partial<AuthUser>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
    );

    // Also sync patient record if applicable
    setPatients((prev) =>
      prev.map((p) => {
        if (p.email.toLowerCase() === currentUser.email.toLowerCase() || p.id === currentUser.id) {
          return {
            ...p,
            name: updated.name || p.name,
            email: updated.email || p.email,
            phone: updated.phone || p.phone
          };
        }
        return p;
      })
    );

    showToast("Profile details updated successfully.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('patient');
    setActiveScreen('login');
    showToast("You have been securely logged out.");
  };

  const handleConfirmBooking = (booking: {
    dentist: Dentist;
    date: string;
    time: string;
    reason: string;
  }) => {
    const patientName = currentUser?.name || 'Alex Johnson';
    
    // Add to appointment list
    const newAppt: Appointment = {
      id: 'a_' + Date.now(),
      dentistId: booking.dentist.id,
      dentistName: booking.dentist.name,
      dentistSpecialty: booking.dentist.specialty,
      date: booking.date,
      time: booking.time,
      patientName: patientName,
      reason: booking.reason,
      status: 'Confirmed',
      notes: 'Initial checkup registered. Please arrive 10 minutes prior.'
    };

    setAppointments([newAppt, ...appointments]);
    setLastBooking(booking);

    // Create confirmation alert
    const newNotification: NotificationItem = {
      id: 'n_' + Date.now(),
      type: 'confirmed',
      title: 'Appointment Booked',
      message: `Your booking with ${booking.dentist.name} for ${booking.date} at ${booking.time} is successfully confirmed.`,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotification, ...notifications]);

    setActiveScreen('appointment-confirmation');
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' as AppointmentStatus } : a));
    
    // Add alert
    const cancelNotif: NotificationItem = {
      id: 'n_' + Date.now(),
      type: 'cancelled',
      title: 'Appointment Cancelled',
      message: 'You have cancelled an upcoming appointment. Refund states (if any) are posted on clinical terms.',
      time: 'Just now',
      read: false
    };
    setNotifications([cancelNotif, ...notifications]);
    showToast("Appointment successfully cancelled.");
  };

  const handleRescheduleAppointment = (id: string) => {
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      const doc = dentists.find(d => d.id === appt.dentistId) || dentists[0];
      setSelectedDentist(doc);
      setActiveScreen('book-appointment');
      showToast("Select a new date and time for your appointment.");
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast("Notifications cleared successfully.");
  };

  // --- Admin Event Handlers ---
  const handleAddDentist = (newDoc: Dentist) => {
    setDentists([...dentists, newDoc]);
    showToast(`${newDoc.name} successfully registered to clinical roster.`);
  };

  const handleDeleteDentist = (id: string) => {
    const doc = dentists.find(d => d.id === id);
    setDentists(dentists.filter(d => d.id !== id));
    showToast(`${doc?.name || 'Dentist'} removed from clinical roster.`);
  };

  const handleToggleAvailability = (id: string) => {
    setDentists(dentists.map(d => d.id === id ? { ...d, availableToday: !d.availableToday } : d));
  };

  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Appointment status changed to ${status}.`);
  };

  const handleAdminAddNewAppointment = (newAppt: Appointment) => {
    setAppointments([newAppt, ...appointments]);
    showToast(`New clinical booking registered for ${newAppt.patientName}.`);
  };

  const handleSaveTreatment = (patientId: string, record: {
    diagnosis: string;
    treatment: string;
    observations: string;
  }) => {
    // Save to target patient history
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          lastVisit: new Date().toISOString().split('T')[0],
          history: [
            {
              date: new Date().toISOString().split('T')[0],
              diagnosis: record.diagnosis,
              treatment: record.treatment,
              observations: record.observations
            },
            ...p.history
          ]
        };
      }
      return p;
    }));

    // Update corresponding patient profile local selection context
    const currentP = patients.find(p => p.id === patientId);
    if (currentP) {
      setSelectedPatient({
        ...currentP,
        lastVisit: new Date().toISOString().split('T')[0],
        history: [
          {
            date: new Date().toISOString().split('T')[0],
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            observations: record.observations
          },
          ...currentP.history
        ]
      });
    }

    // Auto-create a notification alert for that patient
    const treatmentNotif: NotificationItem = {
      id: 'n_' + Date.now(),
      type: 'updated',
      title: 'Clinical Record Updated',
      message: `A new treatment record (${record.treatment.split(' ')[0]}) has been published by your dentist.`,
      time: 'Just now',
      read: false
    };
    setNotifications([treatmentNotif, ...notifications]);
  };

  // --- Dynamic App Bar Title Resolver ---
  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'patient-dashboard': return 'DentalCare';
      case 'dentist-list': return 'Our Specialist Dentists';
      case 'book-appointment': return 'Book Appointment';
      case 'appointment-confirmation': return 'Booking Confirmed';
      case 'my-appointments': return 'My Clinical Schedule';
      case 'notifications': return 'Clinical Alerts';
      case 'patient-profile': return 'My Patient Profile';
      case 'admin-dashboard': return 'Admin Dashboard';
      case 'manage-dentists': return 'Roster Management';
      case 'manage-patients': return 'Patient Records';
      case 'appointment-management': return 'Schedule Management';
      case 'treatment-registration': return 'Record Dental Treatment';
      default: return 'DentalCare';
    }
  };

  const getScreenBackButton = () => {
    return !['patient-dashboard', 'admin-dashboard', 'splash', 'login', 'register'].includes(activeScreen);
  };

  const handleBackNavigation = () => {
    if (activeScreen === 'book-appointment') {
      setActiveScreen('dentist-list');
    } else if (activeScreen === 'dentist-list') {
      setActiveScreen('patient-dashboard');
    } else if (activeScreen === 'my-appointments') {
      setActiveScreen('patient-dashboard');
    } else if (activeScreen === 'notifications') {
      setActiveScreen('patient-dashboard');
    } else if (activeScreen === 'patient-profile') {
      setActiveScreen('patient-dashboard');
    } else if (activeScreen === 'manage-dentists' || activeScreen === 'manage-patients' || activeScreen === 'appointment-management' || activeScreen === 'treatment-registration') {
      setActiveScreen('admin-dashboard');
    } else {
      setActiveScreen(userRole === 'admin' ? 'admin-dashboard' : 'patient-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. Header Toolbar workspace bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4 z-40 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">DentalCare App</h1>
              <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-blue-800">
                Material 3 Specs & Kotlin Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production Architecture • Fully Functional Auth & Records Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/50 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium truncate max-w-[130px]">{currentUser.name}</span>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded font-bold uppercase">{userRole}</span>
            </div>
          )}

          <button 
            onClick={() => {
              setActiveScreen('splash');
              showToast("Simulator returned to Splash screen.");
            }}
            className="text-xs bg-slate-800 hover:bg-slate-700 font-bold text-white px-3.5 py-1.5 rounded-lg transition-all outline-none"
          >
            Reset Intro
          </button>
        </div>
      </header>

      {/* 2. Main split view workspace */}
      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
        
        {/* Left column: M3 Design System Specifications & Documentation */}
        <DesignSystemPanel
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          userRole={userRole}
          onChangeRole={(role) => {
            setUserRole(role);
            if (role === 'admin') {
              const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[2];
              setCurrentUser(adminUser);
              setActiveScreen('admin-dashboard');
            } else {
              const patientUser = users.find(u => u.role === 'patient') || INITIAL_USERS[0];
              setCurrentUser(patientUser);
              setActiveScreen('patient-dashboard');
            }
          }}
        />

        {/* Right column: Interactive Android Phone Frame Simulator */}
        <div className="flex-1 bg-[#0b0f19] flex flex-col items-center justify-center p-4 xl:p-8 overflow-y-auto no-scrollbar relative min-h-[700px]">
          
          {/* Subtle background graphics */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-4 items-center z-10 w-full max-w-[410px]">
            
            {/* Notification/Toast feedback bar inside workspace */}
            {toastMessage && (
              <div className="bg-slate-800 border-l-4 border-l-blue-500 text-slate-200 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-fade-in w-full">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Android Device frame container */}
            <AndroidFrame
              activeScreen={activeScreen}
              onNavigate={handleNavigate}
              title={getScreenTitle()}
              showBackButton={getScreenBackButton()}
              onBack={handleBackNavigation}
              userRole={userRole}
            >
              {/* Conditional viewport screen switching */}
              {activeScreen === 'splash' && (
                <SplashScreenView 
                  onEnter={() => setActiveScreen('login')} 
                />
              )}

              {activeScreen === 'login' && (
                <LoginScreenView
                  onLogin={handleLogin}
                  onGoToRegister={() => setActiveScreen('register')}
                  registeredUsers={users}
                />
              )}

              {activeScreen === 'register' && (
                <RegisterScreenView
                  onRegister={handleRegister}
                  onGoToLogin={() => setActiveScreen('login')}
                  registeredUsers={users}
                />
              )}

              {activeScreen === 'patient-dashboard' && (
                <PatientDashboardView
                  appointments={appointments}
                  notifications={notifications}
                  currentUser={currentUser || undefined}
                  onNavigate={handleNavigate}
                  onSelectAppointment={(appt) => setSelectedAppointment(appt)}
                />
              )}

              {activeScreen === 'dentist-list' && (
                <DentistListView
                  dentists={dentists}
                  onSelectDentist={(dentist) => {
                    setSelectedDentist(dentist);
                    setActiveScreen('book-appointment');
                  }}
                />
              )}

              {activeScreen === 'book-appointment' && (
                <BookAppointmentView
                  dentists={dentists}
                  selectedDentist={selectedDentist}
                  onSelectDentist={setSelectedDentist}
                  onConfirmBooking={handleConfirmBooking}
                />
              )}

              {activeScreen === 'appointment-confirmation' && (
                <AppointmentConfirmationView
                  lastBooking={lastBooking}
                  onFinish={() => setActiveScreen('patient-dashboard')}
                />
              )}

              {activeScreen === 'my-appointments' && (
                <MyAppointmentsView
                  appointments={appointments}
                  selectedAppointment={selectedAppointment}
                  onSelectAppointment={(appt) => {
                    // Toggle selection state
                    if (selectedAppointment?.id === appt.id) {
                      setSelectedAppointment(null);
                    } else {
                      setSelectedAppointment(appt);
                    }
                  }}
                  onCancelAppointment={handleCancelAppointment}
                  onRescheduleAppointment={handleRescheduleAppointment}
                />
              )}

              {activeScreen === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onClearAll={handleClearNotifications}
                />
              )}

              {activeScreen === 'patient-profile' && (
                <PatientProfileView
                  currentUser={currentUser || undefined}
                  onUpdateProfile={handleUpdateProfile}
                  onLogout={handleLogout}
                />
              )}

              {activeScreen === 'admin-dashboard' && (
                <AdminDashboardView
                  appointments={appointments}
                  patients={patients}
                  dentists={dentists}
                  onNavigate={handleNavigate}
                />
              )}

              {activeScreen === 'manage-dentists' && (
                <ManageDentistsView
                  dentists={dentists}
                  onAddDentist={handleAddDentist}
                  onDeleteDentist={handleDeleteDentist}
                  onToggleAvailability={handleToggleAvailability}
                />
              )}

              {activeScreen === 'manage-patients' && (
                <ManagePatientsView
                  patients={patients}
                  onSelectPatient={(p) => setSelectedPatient(p)}
                  onNavigate={handleNavigate}
                />
              )}

              {activeScreen === 'appointment-management' && (
                <AppointmentManagementView
                  appointments={appointments}
                  patients={patients}
                  dentists={dentists}
                  onUpdateStatus={handleUpdateStatus}
                  onAddNewAppointment={handleAdminAddNewAppointment}
                />
              )}

              {activeScreen === 'treatment-registration' && (
                <TreatmentRegistrationView
                  selectedPatient={selectedPatient}
                  onSaveTreatment={handleSaveTreatment}
                />
              )}
            </AndroidFrame>

            {/* Quick Helper guidelines below simulator */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-950/20 px-3 py-1 rounded-full border border-slate-800/40 select-none">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Tip: Switch screens instantly using the Quick Screen Navigator on the left.</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
