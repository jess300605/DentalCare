# DentalCare

App móvil nativa de Android para la gestión de una clínica dental: los
pacientes reservan citas con un dentista, los dentistas gestionan su propia
agenda y registran tratamientos, y el admin administra el catálogo de
dentistas, pacientes y citas de toda la clínica.

## Stack

- **Kotlin + Jetpack Compose** (Material 3) para toda la UI
- **Navigation Compose** para el enrutamiento entre pantallas
- **Firebase Authentication** — email/contraseña y Google Sign-In
- **Cloud Firestore** — base de datos en tiempo real para citas, dentistas,
  pacientes y notificaciones
- **Firestore Security Rules** — el aislamiento de datos por usuario y por
  rol se aplica en el servidor, no solo en el cliente

## Roles

La app tiene tres roles, guardados en `users/{uid}.role` dentro de
Firestore:

| Rol | Qué puede hacer |
|---|---|
| `patient` | Reservar/reprogramar/cancelar sus propias citas, ver solo sus propias notificaciones y su propio historial |
| `dentist` | Ver y actualizar únicamente las citas asignadas a él (vía `users/{uid}.dentistId`), registrar tratamientos en la ficha clínica de cualquier paciente |
| `admin` | Gestionar el catálogo de dentistas, ver y administrar todos los pacientes y todas las citas de la clínica |

**Toda cuenta nueva se crea como `patient`.** No existe ninguna pantalla ni
flujo dentro de la app para auto-asignarse `admin` o `dentist` — ambos se
asignan a mano desde la consola de Firebase. Los pasos exactos están en
[`FIRESTORE_SETUP.md`](./FIRESTORE_SETUP.md).

## Estructura del proyecto

```
app/src/main/java/com/example/dentalcare/
├── MainActivity.kt              # NavHost, Scaffold, y todo el estado en vivo
│                                   conectado a Firestore
├── data/
│   ├── Models.kt                 # Dentist, Patient, Appointment,
│   │                               NotificationItem, UserProfile, etc.
│   ├── AuthRepository.kt         # Login/registro/logout con Firebase Auth
│   └── FirestoreRepository.kt    # Todo el CRUD y los listeners en tiempo
│                                   real de Firestore
└── ui/
    ├── screens/
    │   ├── AuthScreens.kt         # Splash, Login, Register
    │   ├── PatientScreens.kt      # Dashboard, dentistas, reservar cita,
    │   │                           mis citas, notificaciones, perfil
    │   ├── AdminScreens.kt        # Dashboard admin, gestionar dentistas/
    │   │                           pacientes, gestionar citas, tratamientos
    │   └── DentistScreens.kt      # Agenda propia del dentista
    └── theme/Theme.kt             # Tema Material 3 (claro/oscuro)
```

## Firestore: colecciones

| Colección | Descripción |
|---|---|
| `users/{uid}` | Rol y datos básicos de cada cuenta (nombre, email, teléfono, `role`, `dentistId`) |
| `appointments/{id}` | Cada cita (`patientId`, `dentistId`, fecha, hora, estado, notas clínicas) |
| `appointment_slots/{dentistId_fecha_hora}` | Documentos "candado" usados en una transacción para que dos pacientes nunca puedan reservar el mismo horario |
| `dentists/{id}` | Catálogo público de dentistas |
| `patients/{id}` | Ficha clínica de cada paciente (historial de tratamientos); `id` = uid cuando está vinculada a una cuenta |
| `notifications/{id}` | Notificaciones por usuario |

Las reglas de seguridad completas están en [`firestore.rules`](./firestore.rules).

## Puesta en marcha

1. Clona el repo y ábrelo en Android Studio.
2. Sigue [`FIRESTORE_SETUP.md`](./FIRESTORE_SETUP.md) para:
   - Habilitar Firestore en tu proyecto de Firebase
   - Publicar `firestore.rules`
   - Crear tu primer usuario `admin`
3. Sincroniza Gradle y corre la app.
4. La primera vez que entres como admin, el catálogo de dentistas se llena
   automáticamente con datos de ejemplo si está vacío.

## Funcionalidades clave

- **Reservas sin choques de horario.** Reservar y reprogramar corren dentro
  de una transacción de Firestore que usa un documento con ID determinístico
  (`dentistId_fecha_hora`) como candado, así que dos personas nunca pueden
  terminar con el mismo horario aunque confirmen al mismo tiempo.
- **Reprogramar edita la cita existente**, no crea una duplicada.
- **Aislamiento real por usuario y por rol**, aplicado en las reglas de
  Firestore — no es solo un filtro del lado del cliente.
- **Reintentos automáticos** en los listeners de Firestore ante errores
  transitorios (por ejemplo, al cambiar de cuenta), para evitar pantallas
  que se quedan vacías sin explicación.

## Pendientes conocidos

Ver la sección "Pendientes / mejoras futuras" en
[`FIRESTORE_SETUP.md`](./FIRESTORE_SETUP.md) — incluye cosas como un
selector de fecha real para reservar citas, recordatorios automáticos vía
Cloud Functions, y notificar al paciente cuando el admin o el dentista
cambian el estado de su cita.
