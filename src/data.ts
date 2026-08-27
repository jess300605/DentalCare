/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dentist, Patient, Appointment, NotificationItem, AuthUser } from './types';

export const INITIAL_USERS: AuthUser[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: 'password123',
    phone: '+1 (555) 234-5678',
    role: 'patient',
    address: '742 Evergreen Terrace, Springfield',
    createdAt: '2026-01-10'
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phone: '+1 (555) 987-6543',
    role: 'patient',
    address: '104 Maple Street, Metroville',
    createdAt: '2026-02-14'
  },
  {
    id: 'u3',
    name: 'Dr. Sarah Miller',
    email: 'admin@dentalcare.com',
    password: 'admin123',
    phone: '+1 (555) 800-3368',
    role: 'admin',
    address: 'DentalCare Medical Center, Suite 400',
    createdAt: '2025-11-01'
  }
];

export const INITIAL_DENTISTS: Dentist[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Miller',
    specialty: 'Orthodontics & Aesthetic Dentistry',
    rating: 4.9,
    reviewsCount: 142,
    availableToday: true,
    avatarColor: 'bg-primary-m3',
  },
  {
    id: 'd2',
    name: 'Dr. Marcus Vance',
    specialty: 'Pediatric Dentistry Specialist',
    rating: 4.8,
    reviewsCount: 98,
    availableToday: true,
    avatarColor: 'bg-secondary-m3',
  },
  {
    id: 'd3',
    name: 'Dr. Elena Rostova',
    specialty: 'Periodontist & Oral Implantologist',
    rating: 4.9,
    reviewsCount: 115,
    availableToday: true,
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'd4',
    name: 'Dr. James Carter',
    specialty: 'Endodontics (Root Canal Specialist)',
    rating: 4.7,
    reviewsCount: 84,
    availableToday: false,
    avatarColor: 'bg-amber-600',
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    lastVisit: '2026-04-12',
    nextAppointment: '2026-07-19',
    history: [
      {
        date: '2026-04-12',
        diagnosis: 'Mild dental plaque accumulation and localized gingivitis',
        treatment: 'Professional Prophylaxis & Scaling',
        observations: 'Advised patient to use soft-bristled brush and floss daily. Schedule check-up in 3 months.',
      },
      {
        date: '2025-10-15',
        diagnosis: 'Incipient cavity on lower left molar (tooth 36)',
        treatment: 'Composite Resin Filling (Tooth 36)',
        observations: 'Excellent cooperation. Cavity successfully restored. Check margins at next recall.',
      }
    ],
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    lastVisit: '2026-05-20',
    nextAppointment: '2026-07-20',
    history: [
      {
        date: '2026-05-20',
        diagnosis: 'Moderate deep dentinal caries on tooth 45',
        treatment: 'Indirect Pulp Capping & Ceramic Onlay',
        observations: 'Monitored pulp response. Restored anatomy with highly esthetic ceramic onlay.',
      }
    ],
  },
  {
    id: 'p3',
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1 (555) 456-7890',
    lastVisit: '2026-03-10',
    history: [
      {
        date: '2026-03-10',
        diagnosis: 'Impacted wisdom teeth (teeth 18, 28, 38, 48)',
        treatment: 'Surgical extraction of teeth 38 and 48',
        observations: 'Sutures removed. Post-operative healing is excellent. Scheduled remaining extractions.',
      }
    ],
  },
  {
    id: 'p4',
    name: 'Sofia Martinez',
    email: 'sofia.m@example.com',
    phone: '+1 (555) 321-0987',
    lastVisit: '2026-06-01',
    nextAppointment: '2026-07-22',
    history: [
      {
        date: '2026-06-01',
        diagnosis: 'Slight tooth sensitivity and enamel erosion',
        treatment: 'Fluoride Varnish Treatment',
        observations: 'Recommended desensitizing toothpaste. Avoid highly acidic beverages.',
      }
    ],
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    dentistId: 'd1',
    dentistName: 'Dr. Sarah Miller',
    dentistSpecialty: 'Orthodontics & Aesthetic Dentistry',
    date: '2026-07-19',
    time: '10:00 AM',
    patientName: 'Alex Johnson',
    reason: 'Routine Cleaning & Orthodontic Checkup',
    status: 'Confirmed',
    notes: 'Please arrive 10 minutes early. Bring your orthodontic retainer case.',
  },
  {
    id: 'a2',
    dentistId: 'd2',
    dentistName: 'Dr. Marcus Vance',
    dentistSpecialty: 'Pediatric Dentistry Specialist',
    date: '2026-07-20',
    time: '02:30 PM',
    patientName: 'Jane Smith',
    reason: 'Cavity Follow-up & Sealant Placement',
    status: 'Pending',
    notes: 'Checking upper dental arch development.',
  },
  {
    id: 'a3',
    dentistId: 'd3',
    dentistName: 'Dr. Elena Rostova',
    dentistSpecialty: 'Periodontist & Oral Implantologist',
    date: '2026-07-22',
    time: '11:15 AM',
    patientName: 'Sofia Martinez',
    reason: 'Gingival Bleeding Assessment',
    status: 'Pending',
    notes: 'Deep cleaning pocket measurements requested.',
  },
  {
    id: 'a4',
    dentistId: 'd1',
    dentistName: 'Dr. Sarah Miller',
    dentistSpecialty: 'Orthodontics & Aesthetic Dentistry',
    date: '2026-04-12',
    time: '09:00 AM',
    patientName: 'Alex Johnson',
    reason: 'Deep Cleaning & Scale',
    status: 'Completed',
    diagnosis: 'Mild dental plaque accumulation and localized gingivitis',
    treatment: 'Professional Prophylaxis & Scaling',
    observations: 'Advised patient to use soft-bristled brush and floss daily. Schedule check-up in 3 months.',
  },
  {
    id: 'a5',
    dentistId: 'd4',
    dentistName: 'Dr. James Carter',
    dentistSpecialty: 'Endodontics (Root Canal Specialist)',
    date: '2026-07-15',
    time: '04:00 PM',
    patientName: 'Alex Johnson',
    reason: 'Emergency Tooth Ache Assessment',
    status: 'Cancelled',
    notes: 'Patient called to cancel due to travel conflicts. Rescheduled.',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'confirmed',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Sarah Miller on July 19 at 10:00 AM has been successfully confirmed by our team.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'Reminder: Check-up Tomorrow',
    message: 'You have an upcoming appointment with Dr. Sarah Miller tomorrow at 10:00 AM. Please arrive 10 minutes early.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Safety Tip: Smile Prep',
    message: 'Don\'t forget to brush your teeth and floss before coming for your treatment. We look forward to seeing your smile!',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'updated',
    title: 'Appointment Time Updated',
    message: 'Your appointment request has been adjusted to 10:00 AM (originally requested for 9:30 AM) to fit optimal doctor scheduling.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'cancelled',
    title: 'Appointment Cancelled',
    message: 'Your request for July 15 with Dr. James Carter has been successfully cancelled as per your phone request.',
    time: '3 days ago',
    read: true,
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM'
];
