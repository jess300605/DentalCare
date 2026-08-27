/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Dentist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  availableToday: boolean;
  avatarColor: string;
  imageUrl?: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  dentistId: string;
  dentistName: string;
  dentistSpecialty: string;
  date: string;
  time: string;
  patientName: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  observations?: string;
}

export interface NotificationItem {
  id: string;
  type: 'confirmed' | 'reminder' | 'updated' | 'cancelled';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface TreatmentRecord {
  date: string;
  diagnosis: string;
  treatment: string;
  observations: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  nextAppointment?: string;
  history: TreatmentRecord[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'admin';
  avatarUrl?: string;
}

export interface AuthUser extends UserProfile {
  password?: string;
  address?: string;
  createdAt: string;
}

export type ActiveScreen =
  | 'splash'
  | 'login'
  | 'register'
  | 'patient-dashboard'
  | 'dentist-list'
  | 'book-appointment'
  | 'appointment-confirmation'
  | 'my-appointments'
  | 'notifications'
  | 'patient-profile'
  | 'admin-dashboard'
  | 'manage-dentists'
  | 'manage-patients'
  | 'appointment-management'
  | 'treatment-registration';
