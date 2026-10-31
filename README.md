# 🦷 DentalCare — Sistema de Gestión Clínica Odontológica

**DentalCare** es una aplicación móvil nativa para Android diseñada para optimizar la administración de una clínica dental mediante la gestión de pacientes, dentistas, citas médicas y expedientes clínicos. Permite a los pacientes reservar y administrar sus citas, a los dentistas gestionar su agenda y registrar tratamientos, y a los administradores supervisar las operaciones de toda la clínica.

La aplicación utiliza una arquitectura reactiva basada en **Kotlin, Jetpack Compose y Firebase**, con sincronización de datos en tiempo real y reglas de seguridad aplicadas directamente en el servidor.

---

## 📋 Tabla de contenidos

- [Características principales](#-características-principales)
- [Tecnologías utilizadas](#️-tecnologías-utilizadas)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Estructura de la base de datos](#️-estructura-de-la-base-de-datos)
- [Seguridad y control de acceso](#-seguridad-y-control-de-acceso)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y configuración](#-instalación-y-configuración)
- [Asignación de roles](#-asignación-de-roles)
- [Identidad visual](#-identidad-visual)
- [Mejoras futuras](#-mejoras-futuras)
- [Licencia](#-licencia)

---

## 🌟 Características principales

DentalCare cuenta con tres perfiles de usuario, cada uno con funcionalidades y permisos específicos.

### 👤 1. Módulo de paciente

Permite a los pacientes gestionar sus citas y consultar su información personal.

- **Panel principal personalizado:** visualización de la próxima cita y accesos rápidos a las funciones principales.
- **Catálogo de dentistas:** consulta de los profesionales registrados, sus especialidades y disponibilidad.
- **Reserva de citas:** selección de dentista, fecha, horario y motivo de consulta.
- **Validación de disponibilidad:** prevención de reservas duplicadas para un mismo dentista y horario.
- **Gestión de citas:** consulta, reprogramación y cancelación de citas propias.
- **Centro de notificaciones:** consulta de notificaciones relacionadas con sus citas y actividad clínica.
- **Historial clínico:** acceso al historial de tratamientos propio.
- **Perfil de usuario:** consulta de datos personales y cierre de sesión.
- **Personalización de la aplicación:** modo claro, modo oscuro y selección de idioma español o inglés, según la configuración disponible.

### 🩺 2. Módulo de dentista

Proporciona herramientas para organizar la agenda profesional y documentar la atención odontológica.

- **Agenda personalizada:** visualización exclusiva de las citas asignadas al dentista autenticado.
- **Gestión de citas:** actualización del estado de las citas, incluyendo confirmada, en progreso, completada y cancelada, según las operaciones permitidas.
- **Registro de tratamientos:** documentación de diagnósticos, tratamientos realizados y observaciones clínicas.
- **Historial de pacientes:** consulta y actualización de las fichas clínicas dentro de los permisos autorizados.
- **Sincronización en tiempo real:** actualización de la agenda cuando cambian los datos en Firestore.

### 🛡️ 3. Módulo de administrador

Permite supervisar y gestionar las operaciones generales de la clínica.

- **Dashboard clínico:** indicadores de citas, pacientes registrados y dentistas activos.
- **Gestión de dentistas:** registro, consulta, edición y eliminación de profesionales del catálogo, según las operaciones implementadas.
- **Control de disponibilidad:** administración de la disponibilidad de los dentistas.
- **Gestión de pacientes:** consulta y administración de los registros de pacientes.
- **Gestión global de citas:** supervisión de las citas de la clínica y administración de sus estados.
- **Gestión de tratamientos:** acceso a las funciones administrativas relacionadas con las fichas clínicas, de acuerdo con los permisos establecidos.

---


## Usuarios de prueba

Las siguientes credenciales pueden utilizarse para probar el inicio de sesión de la aplicación.

| Rol | Correo electrónico | Contraseña |
|---|---|---|
| Doctor | `Marcus@doctor.sv` | `doctorsv2026` |
| Administrador | `Admin2@doctor.sv` | `admin2026` |
| Doctor | `James@doctor.sv` | `doctorsv2026` |



## 🛠️ Tecnologías utilizadas

| Tecnología | Propósito |
|---|---|
| **Kotlin** | Lenguaje principal de desarrollo. |
| **Jetpack Compose** | Construcción de interfaces de usuario declarativas. |
| **Material Design 3** | Componentes visuales y sistema de diseño. |
| **Navigation Compose** | Navegación entre pantallas. |
| **Firebase Authentication** | Autenticación mediante correo electrónico y contraseña, y Google Sign-In. |
| **Cloud Firestore** | Almacenamiento y sincronización de datos en tiempo real. |
| **Firestore Security Rules** | Control de acceso a los datos en el servidor. |
| **Kotlin Coroutines** | Ejecución de operaciones asíncronas. |
| **Flow / produceState** | Integración de datos reactivos con la interfaz de usuario. |
| **Firestore Transactions** | Operaciones atómicas para reservar y reprogramar citas. |
| **Android SDK** | Plataforma de ejecución y compilación de la aplicación. |

### Arquitectura y patrones de diseño

El proyecto utiliza el patrón **Repository** para centralizar las operaciones de acceso a datos y separar la lógica de autenticación de las operaciones de Firestore.

La interfaz se basa en Jetpack Compose y en un flujo reactivo de información que permite reflejar los cambios recibidos desde Firebase.

La estructura actual centraliza buena parte de la navegación y el estado en `MainActivity.kt`. La separación de pantallas, modelos y repositorios facilita el mantenimiento y permite evolucionar hacia una arquitectura MVVM más completa con ViewModels dedicados.

---

## 📁 Arquitectura del proyecto

```text
DentalCare/
├── app/
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/example/dentalcare/
│           │       ├── MainActivity.kt
│           │       ├── data/
│           │       │   ├── Models.kt
│           │       │   ├── AuthRepository.kt
│           │       │   └── FirestoreRepository.kt
│           │       └── ui/
│           │           ├── screens/
│           │           │   ├── AuthScreens.kt
│           │           │   ├── PatientScreens.kt
│           │           │   ├── AdminScreens.kt
│           │           │   └── DentistScreens.kt
│           │           └── theme/
│           │               ├── Color.kt
│           │               ├── Theme.kt
│           │               └── Type.kt
│           └── AndroidManifest.xml
├── firestore.rules
├── FIRESTORE_SETUP.md
├── README.md
├── build.gradle.kts
└── settings.gradle.kts
```

**Responsabilidad de los principales archivos:**

- `MainActivity.kt`: punto de entrada, navegación principal, estructura visual y coordinación del estado global.
- `Models.kt`: modelos de datos de usuarios, dentistas, pacientes, citas y notificaciones.
- `AuthRepository.kt`: registro, inicio de sesión y cierre de sesión mediante Firebase Authentication.
- `FirestoreRepository.kt`: consultas, operaciones CRUD, transacciones y listeners de Firestore.
- `AuthScreens.kt`: pantallas de bienvenida, inicio de sesión y registro.
- `PatientScreens.kt`: panel del paciente, catálogo de dentistas, citas, notificaciones y perfil.
- `DentistScreens.kt`: agenda y herramientas del dentista.
- `AdminScreens.kt`: panel administrativo y gestión de los recursos de la clínica.
- `Theme.kt`, `Color.kt` y `Type.kt`: configuración visual de Material Design 3.

---

## 🗄️ Estructura de la base de datos

DentalCare utiliza Cloud Firestore como base de datos NoSQL. La información se organiza en las siguientes colecciones:

| Colección | Descripción |
|---|---|
| `users/{uid}` | Perfil de cada cuenta, incluyendo nombre, correo, teléfono, rol y, cuando corresponda, `dentistId`. |
| `appointments/{id}` | Información de las citas: `patientId`, `dentistId`, fecha, hora, estado y notas permitidas. |
| `appointment_slots/{slotId}` | Documentos de bloqueo de horarios utilizados para prevenir reservas simultáneas. |
| `dentists/{id}` | Catálogo de dentistas, con información profesional y disponibilidad. |
| `patients/{id}` | Fichas clínicas de los pacientes e historial de tratamientos. Cuando está vinculada a una cuenta, el ID corresponde al UID del usuario. |
| `notifications/{id}` | Notificaciones asociadas a usuarios y eventos de la aplicación. |

### 🔐 Prevención de reservas duplicadas

La aplicación utiliza transacciones de Firestore y documentos de bloqueo con identificadores determinísticos para gestionar la disponibilidad de los horarios.

El flujo de reserva verifica la disponibilidad y crea o actualiza la cita dentro de una operación atómica. Si dos pacientes intentan reservar el mismo horario simultáneamente, la transacción permite detectar el conflicto y evita que ambos obtengan la misma reserva.

La reprogramación actualiza la cita existente en lugar de crear una nueva. El bloqueo del horario anterior y la adquisición del nuevo deben gestionarse dentro de la misma operación transaccional para conservar la integridad de la agenda.

---

## 🔒 Seguridad y control de acceso

La seguridad de DentalCare se basa en Firebase Authentication y Firestore Security Rules.

Los permisos se validan en el servidor, de modo que la protección de los datos no depende exclusivamente de los filtros de la interfaz.

### Roles disponibles

| Rol | Permisos principales |
|---|---|
| `patient` | Gestionar sus propias citas y consultar sus notificaciones e historial clínico. |
| `dentist` | Consultar y actualizar sus citas asignadas, e intervenir en las fichas clínicas según las reglas establecidas. |
| `admin` | Administrar el catálogo de dentistas, los pacientes y las citas de la clínica. |

### Principios de seguridad

- **Principio de mínimo privilegio:** cada usuario debe acceder únicamente a los recursos necesarios para su función.
- **Aislamiento por usuario:** los pacientes solo pueden acceder a sus propios datos.
- **Aislamiento por dentista:** la agenda se limita al profesional vinculado mediante `users/{uid}.dentistId`.
- **Autorización del lado del servidor:** las operaciones se validan con las reglas de Firestore.
- **Asignación controlada de roles:** los usuarios nuevos se registran como pacientes.
- **Protección de información clínica:** el acceso a los expedientes debe estar limitado a los usuarios expresamente autorizados.

> **Importante:** las reglas deben validar cada operación de lectura y escritura, así como los campos que pueden modificarse. Los datos clínicos requieren especial protección. El acceso de un dentista al historial de cualquier paciente debe estar limitado a lo que autorice expresamente la política de seguridad de la clínica.

El archivo `firestore.rules` contiene las reglas que deben publicarse en el proyecto de Firebase. Es imprescindible revisar y probar esas reglas antes de utilizar información clínica real.

---

## 💻 Requisitos previos

Antes de ejecutar DentalCare, asegúrate de contar con lo siguiente:

- **Android Studio:** Koala, Ladybug o una versión compatible más reciente.
- **JDK:** la versión requerida por el Gradle Wrapper y los plugins del proyecto.
- **Android SDK:** API 35 como objetivo de compilación, según la configuración indicada.
- **Dispositivo o emulador:** Android 8.0 (API 26) o superior.
- **Google Play Services:** necesario para probar Google Sign-In en el entorno correspondiente.
- **Cuenta de Firebase:** para configurar Authentication y Cloud Firestore.
- **Git:** para clonar y actualizar el repositorio.

La versión del JDK debe verificarse en la configuración de Gradle del proyecto, ya que el requisito exacto depende de las versiones de Gradle y de los plugins instalados.

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

Clona el proyecto desde su repositorio de GitHub:

```bash[
git clone <URL_DEL_REPOSITORIO>](https://github.com/jess300605/DentalCare)
cd DentalCare
```

### 2. Crear y configurar Firebase

1. Accede a la [Consola de Firebase](https://console.firebase.google.com/).
2. Crea un proyecto o selecciona uno existente.
3. Registra una aplicación Android con el identificador de paquete `com.example.dentalcare`.
4. Descarga el archivo `google-services.json`.
5. Coloca el archivo dentro de la carpeta `app/`.
6. Verifica que el plugin de Google Services y las dependencias de Firebase estén configurados en los archivos Gradle.

### 3. Habilitar Firebase Authentication

Desde Firebase Console:

1. Abre **Authentication**.
2. Accede a la sección de proveedores de inicio de sesión.
3. Habilita **Correo electrónico/Contraseña**.
4. Configura **Google Sign-In** si se utilizará este método.
5. Configura las huellas SHA necesarias para Google Sign-In en Android.

### 4. Habilitar Cloud Firestore

1. Accede a **Firestore Database**.
2. Crea la base de datos del proyecto.
3. Selecciona la ubicación adecuada para la aplicación.
4. Verifica que la aplicación apunte al proyecto de Firebase correcto.

### 5. Publicar las reglas de seguridad

Abre el archivo `firestore.rules` del repositorio.

Publica su contenido desde **Firebase Console → Firestore Database → Reglas**, o mediante Firebase CLI si el proyecto ya está configurado para utilizarlo.

No publiques reglas permisivas en producción. Las reglas definitivas deben verificar la autenticación, el rol, la propiedad de los documentos y los campos modificables.

### 6. Ejecutar la aplicación

1. Abre el proyecto en Android Studio.
2. Sincroniza Gradle.
3. Selecciona un dispositivo o emulador compatible.
4. Ejecuta la aplicación.
5. Registra una cuenta para comprobar el flujo de autenticación.
6. Configura los roles administrativos y de dentista siguiendo las instrucciones de la siguiente sección.

Para obtener los pasos específicos de configuración de Firestore, consulta `FIRESTORE_SETUP.md`.

---

## 👥 Asignación de roles

DentalCare utiliza tres roles: `patient`, `dentist` y `admin`.

**Toda cuenta nueva debe crearse con el rol `patient`.** No debe existir un flujo público que permita a un usuario asignarse privilegios administrativos o de dentista.

### Crear el primer administrador

1. Registra una cuenta desde la aplicación.
2. En Firebase Console, abre Firestore Database.
3. Busca el documento correspondiente en `users/{uid}`.
4. Cambia el campo `role` de `patient` a `admin`.
5. Reinicia la sesión o vuelve a iniciar sesión para comprobar que se carga el perfil correcto.

### Asignar un dentista a una cuenta

1. Inicia sesión con una cuenta que tenga permisos administrativos.
2. Registra al profesional en el catálogo de dentistas.
3. Crea la cuenta de acceso del profesional.
4. Localiza su documento en `users/{uid}`.
5. Cambia el campo `role` a `dentist`.
6. Agrega el campo `dentistId` con el ID exacto del documento correspondiente en la colección `dentists`.

La asignación manual de roles debe realizarse únicamente por una persona autorizada. Es recomendable restringir los permisos de administración de Firebase y conservar un procedimiento controlado para estos cambios.

---

## 🎨 Identidad visual

DentalCare incorpora la marca gráfica `ico_dentalcare` en los elementos principales de la aplicación:

- Icono del lanzador de Android.
- Pantalla de bienvenida (*Splash Screen*).
- Pantallas de inicio de sesión y registro.
- Barra superior de la aplicación.

La interfaz utiliza Material Design 3 para mantener una experiencia visual coherente, con soporte para temas claro y oscuro según las opciones disponibles en el proyecto.

---

## 🔮 Mejoras futuras

Las siguientes mejoras pueden ampliar las capacidades de DentalCare:

- **Selector de fecha interactivo:** facilitar la selección de fechas y horarios disponibles.
- **Recordatorios automáticos:** enviar notificaciones de citas próximas mediante Firebase Cloud Functions.
- **Notificaciones de cambios de estado:** avisar al paciente cuando una cita sea confirmada, reprogramada o cancelada por el dentista o administrador.
- **Pruebas de seguridad:** ampliar las pruebas automatizadas de Firestore Security Rules con Firebase Emulator Suite.
- **Mejoras de arquitectura:** separar el estado y la lógica de presentación en ViewModels dedicados.
- **Validación de disponibilidad:** incorporar reglas para duración de tratamientos, horarios laborales y posibles conflictos de agenda.
- **Auditoría clínica:** registrar cambios relevantes en expedientes y estados de citas.
- **Accesibilidad y experiencia de usuario:** mejorar la navegación, la compatibilidad con lectores de pantalla y la adaptación a diferentes tamaños de pantalla.

Para conocer los pendientes específicos de la implementación actual, consulta la sección *Pendientes / mejoras futuras* de `FIRESTORE_SETUP.md`.

---

## 📄 Licencia

DentalCare es un proyecto desarrollado como solución de gestión odontológica con fines académicos y de desarrollo.

Se permite su uso y modificación con fines académicos o de desarrollo, de acuerdo con las condiciones establecidas por el autor del proyecto. Si se desea distribuir públicamente, conviene incorporar un archivo `LICENSE` con los términos exactos de la licencia elegida.

---

**DentalCare — Tecnología al servicio de una atención odontológica organizada, segura y eficiente.** 🦷
