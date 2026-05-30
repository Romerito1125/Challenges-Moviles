# Frontend — Control de Asistencia Laboral

Aplicación móvil y web para el registro de jornadas laborales. Construida con Ionic + React + TypeScript. Corre en navegador y en Android via Capacitor.

---

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Para Android: Android Studio con SDK configurado y Capacitor CLI

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con:

```
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```

El backend corre en `http://localhost:3000/api` por defecto. Para cambiarlo, editar `src/api/axiosClient.ts`.

---

## Comandos

```bash
npm install --legacy-peer-deps   # instalar dependencias
npm run dev                      # servidor de desarrollo en localhost:8100
npm run build                    # build de producción
npm run test.unit                # tests unitarios con Vitest
```

Para correr en Android:

```bash
npm run build
npx cap sync android
npx cap run android
```

Para desarrollo en dispositivo físico con live reload:

```bash
ionic capacitor run android --livereload --external --host=<IP_LOCAL>
```

---

## Estructura del proyecto

```
src/
  api/           Servicios HTTP hacia el backend
  components/    Componentes reutilizables
  context/       Contextos globales de React
  dexie/         Configuración de IndexedDB
  firebase/      Configuración de Firebase (sin uso activo)
  hooks/         Hooks de React
  pages/         Pantallas de la aplicación
  supabase/      Cliente de Supabase Auth
  theme/         Variables CSS globales e importación de Tailwind
```

---

## Capas de la aplicación

### Autenticación — Supabase Auth

El archivo `src/supabase/client.ts` inicializa el cliente de Supabase con las variables de entorno. Toda la lógica de sesión vive en `src/hooks/useAuth.tsx`, que expone `login`, `register`, `logout` y el estado `user` / `session`.

`src/context/AuthContext.tsx` envuelve ese hook en un contexto de React para que cualquier componente pueda acceder a la sesión sin prop drilling. Se monta en `App.tsx` como proveedor raíz.

Al hacer logout se limpia también el `sessionStorage` donde se cachea el id numérico del empleado.

### Comunicación con el backend — Axios

`src/api/axiosClient.ts` crea una instancia de Axios con `baseURL: http://localhost:3000/api`. Tiene un interceptor de request que lee la sesión activa de Supabase y adjunta el JWT en el header `Authorization: Bearer <token>` en cada llamada. El backend usa ese token para identificar al usuario.

Todos los servicios de la capa `api/` usan esta instancia.

### Servicios HTTP

**`src/api/employeeService.ts`**

Gestiona empleados. Funciones principales:

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getEmployees` | GET | `/employees` | Lista todos los empleados |
| `getEmployeeById` | GET | `/employees/:id` | Empleado por id numérico |
| `getMyProfile` | GET | `/employees/me` | Perfil del usuario logueado (usa el JWT) |
| `getMyEmployeeId` | GET | `/employees/me` | Igual que el anterior pero devuelve solo el id numérico. Cachea el resultado en `sessionStorage` para no repetir la llamada |
| `createEmployee` | POST | `/employees` | Crea el empleado y dispara la invitación por email via Supabase Auth en el backend |
| `updateEmployee` | PUT | `/employees/:id` | Actualiza datos del empleado |
| `deleteEmployee` | DELETE | `/employees/:id` | Elimina el empleado |

**`src/api/jornadaService.ts`**

Gestiona el ciclo de jornadas en dos pasos separados:

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `marcarEntrada` | POST | `/jornadas` | Crea el registro con hora de entrada. `hora_salida` queda en null. Devuelve el `id` del registro |
| `marcarSalida` | PATCH | `/jornadas/:id/salida` | Cierra el registro con hora de salida. El backend calcula `horas_trabajadas` y `horas_extra` |
| `getJornadasByEmpleado` | GET | `/jornadas/empleado/:id` | Historial de jornadas de un empleado |
| `getResumenExtrasEmpleado` | GET | `/jornadas/empleado/:id/resumen-extras` | Acumulado histórico de horas extra y valor monetario |
| `updateJornada` | PUT | `/jornadas/:id` | Edición completa de una jornada (solo admin) |
| `deleteJornada` | DELETE | `/jornadas/:id` | Elimina una jornada (solo admin) |

**`src/api/pagoService.ts`**

Gestiona pagos programados a empleados. Funciones: `getPagos`, `getPagoById`, `getPagosByEmpleado`, `createPago`, `updatePago`, `deletePago`. Los endpoints siguen el patrón `/pagos` y `/pagos/empleado/:id`.

### Almacenamiento local

La aplicación usa dos mecanismos de almacenamiento local para funcionar sin conexión:

**localStorage** — datos ligeros: estado de la jornada activa (`jornada_activa`) e historial de jornadas (`jornadas_historial`). No se guardan aquí las fotos porque superan el límite de ~5 MB.

**IndexedDB via Dexie** — fotos en base64. `src/dexie/config.ts` define la base de datos `MiAppDB` con la tabla `fotos` (campos: `id`, `dataUrl`, `createdAt`). Cada foto se guarda con un id único. En localStorage y en el estado de React solo se guarda ese id; el `dataUrl` se resuelve desde IndexedDB al montar los componentes.

### Jornada — hook y contexto

`src/hooks/useJornadaLocal.ts` contiene toda la lógica del ciclo de jornada:

- Al montar, lee localStorage y resuelve las fotos desde IndexedDB.
- `iniciarJornada(foto, coords, idEmpleado)`: guarda la foto en IndexedDB, el resto en localStorage, y llama a `marcarEntrada` en el backend. Si el backend responde, guarda el `idBackend` en el estado. Si falla, la jornada queda marcada como no sincronizada.
- `finalizarJornada(coords)`: si hay `idBackend`, llama a `marcarSalida` en el backend y marca el registro como sincronizado. Si no hay `idBackend` o la llamada falla, guarda el registro localmente con `sincronizado: false`.
- `sincronizarPendientes()`: recorre el historial buscando registros con `sincronizado: false` y los envía al backend en orden.

`src/context/JornadaContext.tsx` envuelve ese hook en un contexto de React. Esto es necesario porque Ionic monta y desmonta componentes al navegar, lo que reiniciaría el estado del hook en cada pantalla. Con el contexto, el estado persiste durante toda la sesión.

---

## Pantallas

### Flujo de autenticación

**`/login` — Login.tsx**
Formulario de email y contraseña. Llama a `useAuthContext().login()`. Al autenticarse redirige a `/home`.

**`/register` — Registro.tsx**
Registro de cuenta nueva. Llama a `useAuthContext().register()`.

**`/set-password` — SetPassword.tsx**
Pantalla para empleados invitados. Supabase incluye un token en el hash de la URL al hacer clic en el email de invitación. El SDK de Supabase procesa ese token automáticamente. La pantalla escucha el evento `SIGNED_IN` via `onAuthStateChange`, muestra el formulario de nueva contraseña y llama a `supabase.auth.updateUser({ password })`. Funciona tanto en navegador (URL con hash) como en móvil (deep link `io.ionic.starter://set-password`).

### Flujo del empleado

**`/home` — Home.tsx**
Pantalla principal. Muestra el reloj en tiempo real (zona horaria Colombia), el estado de la jornada activa y un cronómetro si hay jornada en curso. El botón "Marcar Entrada" navega a `/camera-capture`. El botón "Marcar Salida" muestra un alert de confirmación y llama a `finalizarJornada()`, luego navega a `/jornada-resumen` pasando el registro via `location.state`.

**`/camera-capture` — CameraCapture.tsx**
Pantalla intermedia al marcar entrada. Obtiene la ubicación GPS con `useGeolocation` al montar. El empleado toma una foto con `useCamera` (Capacitor Camera, resultado en base64). Al pulsar "Verificar y comenzar jornada":
1. Llama a `getMyEmployeeId()` para obtener el id numérico del empleado desde el backend.
2. Llama a `iniciarJornada(foto, coords, idEmpleado)` del contexto.
3. Redirige a `/home`.

**`/jornada-resumen` — JornadaResumen.tsx**
Muestra el resumen de la jornada recién finalizada: duración, hora de entrada y salida, horas trabajadas, foto de entrada, mapa con la ubicación de entrada y estado de sincronización. Recibe los datos via `location.state.jornada`.

**`/employee-history` — WorkHistory.tsx**
Historial de jornadas del empleado leído desde el contexto de jornada (localStorage + IndexedDB). Cada jornada es expandible y muestra el mapa de ubicación de entrada via `MapaUbicacion`.

**`/profile` — Profile.tsx**
Llama a `getMyProfile()` para mostrar los datos del empleado logueado: nombre, email, cédula, salario y rol. Incluye el botón de cerrar sesión.

### Flujo del administrador

**`/admin-dashboard` — AdminDashboard.tsx**
Panel con lista de empleados y formulario para crear o editar. Al crear un empleado, el backend envía automáticamente la invitación por email.

**`/employees` — EmployeesManagement.tsx**
Lista de empleados con las mismas operaciones que el dashboard. Funciona como vista alternativa.

**`/employees/:id` — EmployeeDetail.tsx**
Detalle de un empleado. Muestra el resumen histórico de horas extra, un selector de mes para filtrar jornadas, los totales del mes y la lista de jornadas. Permite crear, editar y eliminar jornadas manualmente.

**`/work-location` — WorkLocation.tsx**
Pantalla para configurar el radio de trabajo permitido. Actualmente es un placeholder funcional sin conexión al backend.

---

## Componentes reutilizables

**`MapaUbicacion.tsx`**
Recibe `lat`, `lng` y un `label`. Renderiza un mapa interactivo con Leaflet usando tiles de OpenStreetMap (sin API key). Hace geocodificación inversa via la API de Nominatim para mostrar la dirección aproximada en español debajo del mapa.

**`EmployeeForm.tsx`**
Formulario para crear y editar empleados. En modo creación el campo email está habilitado y el botón dice "Crear e invitar". En modo edición el email se deshabilita porque no se puede cambiar sin afectar la cuenta de Supabase Auth.

**`EmployeeItem.tsx`**
Fila de empleado en una lista con botones de editar y eliminar.

**`JornadaForm.tsx`**
Formulario para crear y editar jornadas desde el panel admin. Incluye fecha, hora de entrada, hora de salida y horas de descanso.

**`JornadaItem.tsx`**
Fila de jornada en una lista con botones de editar y eliminar.

**`PagoForm.tsx` / `PagoItem.tsx`**
Formulario y fila para pagos. Los servicios están implementados pero no hay una página dedicada a pagos aún.

---

## Hooks

| Hook | Archivo | Descripción |
|---|---|---|
| `useAuth` | `hooks/useAuth.tsx` | Sesión de Supabase: login, register, logout, user, session, isPending |
| `useJornadaLocal` | `hooks/useJornadaLocal.ts` | Ciclo completo de jornada con almacenamiento offline-first |
| `useEmployees` | `hooks/useEmployees.ts` | CRUD de empleados con estado local (lista, isPending, error) |
| `useJornadas` | `hooks/useJornadas.ts` | CRUD de jornadas para el panel admin |
| `usePagos` | `hooks/usePagos.ts` | CRUD de pagos |
| `useCamera` | `hooks/useCamera.ts` | Wrapper de Capacitor Camera. Devuelve la foto como base64 DataUrl |
| `useGeolocation` | `hooks/useGeolocation.ts` | Wrapper de Capacitor Geolocation. Expone `getCurrentLocation`, `startTracking`, `stopTracking` |
| `useNetwork` | `hooks/useNetwork.tsx` | Detecta el estado de la conexión via Capacitor Network. No está conectado aún a la sincronización automática de jornadas |

---

## Formato de respuesta del backend

Todas las respuestas del backend deben seguir este contrato:

```json
// Éxito
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "descripción del error" }
```

El tipo `ApiResponse<T>` en `employeeService.ts` modela este contrato y es usado por todos los servicios.

---

## Notas

- `firebase/config.ts` está presente pero sin uso activo en la aplicación.
- `useNetwork` detecta la conectividad pero la sincronización automática de jornadas pendientes debe llamarse manualmente via `sincronizarPendientes()` del contexto de jornada.
- El campo `auth_user_id` en la tabla `employees` es el vínculo entre Supabase Auth y el registro del empleado. Si ese campo es null, `GET /api/employees/me` devuelve 404 y el empleado no puede marcar jornadas.
## Sensores y permisos del dispositivo

La aplicación accede a tres sensores del dispositivo a través de los plugins de Capacitor. En web, el navegador solicita los permisos nativos del sistema. En Android, los permisos se declaran en `AndroidManifest.xml` y se solicitan en tiempo de ejecución.

### Cámara

Plugin: `@capacitor/camera`
Hook: `src/hooks/useCamera.ts`

Se usa exclusivamente en `CameraCapture.tsx` al marcar entrada. El hook llama a `Camera.getPhoto()` con las siguientes opciones:

- `resultType: CameraResultType.DataUrl` — devuelve la imagen como base64 para poder guardarla en IndexedDB sin depender del sistema de archivos.
- `source: CameraSource.Camera` — fuerza el uso de la cámara en vivo, no la galería.
- `quality: 80` — compresión JPEG para reducir el tamaño del `dataUrl`.

La foto resultante se pasa a `iniciarJornada()` y se persiste en IndexedDB. Solo se guarda una foto por jornada (la de entrada). No se toma foto al marcar salida.

Permisos requeridos en Android: `CAMERA`.

### Ubicación (GPS)

Plugin: `@capacitor/geolocation`
Hook: `src/hooks/useGeolocation.ts`

El hook expone tres funciones:

- `getCurrentLocation()` — obtiene una lectura puntual con `Geolocation.getCurrentPosition()`. Se usa en `CameraCapture.tsx` al montar la pantalla para capturar las coordenadas de entrada antes de que el empleado tome la foto.
- `startTracking()` / `stopTracking()` — inician y detienen un watcher continuo con `Geolocation.watchPosition()`. Están implementados pero no se invocan actualmente desde ninguna pantalla.

Las coordenadas de entrada (`lat`, `lng`) se guardan junto con el registro de jornada en localStorage y se envían al backend en `marcarEntrada`. Se muestran en `JornadaResumen.tsx` y `WorkHistory.tsx` a través del componente `MapaUbicacion`.

Permisos requeridos en Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`.

### Red (conectividad)

Plugin: `@capacitor/network`
Hook: `src/hooks/useNetwork.tsx`

El hook escucha el evento `Network.addListener('networkStatusChange', ...)` y expone el estado actual de la conexión (`isConnected`, `connectionType`). Se usa para mostrar indicadores visuales de conectividad en la UI.

La sincronización automática de jornadas pendientes **no está conectada** a este hook. Cuando la red se recupera, `sincronizarPendientes()` debe llamarse manualmente desde el contexto de jornada. La integración automática está pendiente de implementación.
