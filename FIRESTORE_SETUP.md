# DentalCare — Puesta en marcha de Firestore

## Qué cambió

- Las citas, dentistas, pacientes (fichas clínicas) y notificaciones ahora
  viven en **Firestore**, no en memoria local. Se actualizan en tiempo real
  (`addSnapshotListener`), así que si el admin cambia el estado de una cita,
  el paciente la ve actualizada sin recargar.
- El rol (`patient` / `admin`) vive en `users/{uid}.role` en Firestore. **Ya
  no se decide revisando si el correo contiene la palabra "admin"** — eso
  era falsificable por cualquiera. Ahora toda cuenta nueva se crea como
  `"patient"` y solo se vuelve `"admin"` si tú lo cambias a mano.
- Se arreglaron las 4 rutas del panel admin que no existían en el `NavHost`
  (`manage-dentists`, `manage-patients`, `appointment-management`,
  `treatment-registration`) y que hacían crashear la app al tocarlas.

## Pasos para dejarlo funcionando

### 1. Habilitar Firestore
En la [consola de Firebase](https://console.firebase.google.com/) → tu
proyecto → **Firestore Database** → **Crear base de datos** → modo
producción (no "modo de prueba", ya que vamos a subir reglas reales).

### 2. Publicar las reglas de seguridad
Copia el contenido de `firestore.rules` (en la raíz del proyecto) y pégalo
en la consola: **Firestore Database → Reglas**, y publica. Estas reglas son
las que de verdad hacen que cada paciente solo vea sus propias citas —
aunque alguien modifique la app, el servidor rechaza cualquier lectura/
escritura fuera de lo permitido.

### 3. Sincronizar Gradle
Abre el proyecto en Android Studio y dale "Sync Now" — se agregaron
`firebase-firestore` y `kotlinx-coroutines-play-services` como
dependencias nuevas.

### 4. Crear tu primer admin
1. Registra una cuenta normal desde la app (como paciente).
2. Ve a **Firestore Database → users** en la consola, busca el documento
   cuyo ID es el `uid` de esa cuenta (lo puedes confirmar en
   **Authentication → Users**).
3. Cambia el campo `role` de `"patient"` a `"admin"`.
4. Cierra sesión y vuelve a iniciar sesión en la app con esa cuenta — ahora
   entrará como admin.

No hay ninguna pantalla ni botón en la app para auto-asignarse admin; es
intencional.

### 4b. Crear una cuenta de dentista

El mismo patrón manual aplica para el rol `"dentist"`, con un paso extra:
vincularla a una ficha del catálogo de dentistas.

1. Asegúrate de que el dentista ya exista en la app (admin → Gestionar
   Dentistas). Copia el **ID del documento** de ese dentista desde
   **Firestore Database → dentists**.
2. Pide a esa persona que se registre normalmente desde la app (queda
   como `"patient"`).
3. En **Firestore Database → users**, busca su documento (ID = su uid) y
   cambia:
   - `role` → `"dentist"`
   - `dentistId` → el ID del documento del dentista que copiaste en el
     paso 1
4. Que cierre sesión y vuelva a entrar — ahora verá "Mi Agenda" con solo
   las citas asignadas a esa ficha de dentista, nunca las de otro.

Si `dentistId` queda vacío o apunta a un dentista que no existe, la app
se lo avisa en pantalla en vez de mostrar una lista vacía sin explicación.

### 5. Catálogo de dentistas
La primera vez que una cuenta admin entra al panel, la app revisa si la
colección `dentists` está vacía y, si lo está, la llena con el roster de
ejemplo (`InitialData.dentists` en `Models.kt`). Después de eso, todo se
gestiona desde **Gestionar Dentistas** en la app.

## Pendientes / mejoras futuras (no incluidas en esta entrega)
- "Reschedule" (reagendar) crea una cita nueva en vez de editar la
  existente — la cita original queda "huérfana" en vez de cancelarse
  automáticamente.
- Las notificaciones solo se generan al reservar una cita; no hay
  recordatorios automáticos (requeriría Cloud Functions + Cloud
  Scheduler, que sí necesita el plan Blaze).
- `google-services.json` y el `WEB_CLIENT_ID` de Google están en el
  repositorio; no son secretos críticos para Android, pero si el repo es
  público vale la pena saberlo.
