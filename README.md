# Andromeda Studio

Sistema integral de gestión administrativa y financiera diseñado para academias de danza y estudios artísticos. La plataforma centraliza el seguimiento de alumnos, la administración de elencos o crews, la facturación recurrente de cuotas y matrículas, la cobranza con planes de descuento y el control de caja diario.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Módulos del sistema](#módulos-del-sistema)
- [Arquitectura y tecnologías](#arquitectura-y-tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha local](#puesta-en-marcha-local)
  - [1. Base de datos](#1-base-de-datos)
  - [2. Backend (.NET 10 Web API)](#2-backend-net-10-web-api)
  - [3. Frontend (React + Vite)](#3-frontend-react--vite)
- [Configuración de entorno](#configuración-de-entorno)
- [Documentación de la API](#documentación-de-la-api)

---

## Descripción general

Andromeda Studio resuelve la operativa cotidiana de un estudio de danza:
- Registro y ficha médica/apto físico de alumnos.
- Organización de grupos de entrenamiento y competencia (crews) por nivel, edad y cupo.
- Emisión automática de aranceles periódicos y cargos por matrícula o clases sueltas.
- Registro de pagos con imputación a cargos pendientes y soporte de descuentos promocionales o personalizados.
- Arqueo y balance de caja chica diaria (ingresos, egresos, saldos de apertura y cierre).

---

## Módulos del sistema

### Alumnos
- Alta, edición y baja lógica de alumnos.
- Ficha de contacto (DNI, teléfono, email, observaciones).
- Control de certificado de apto físico vigente.
- Historial de pagos y estado de cuenta individual.

### Crews y Clases
- Clasificación por nivel (Recreational, Competitive, Elite).
- Segmentación por categorías de edad (Baby, Junior, Varsity, Senior) y modalidad de grupo (MiniCrew, Crew, MegaCrew).
- Asignación de alumnos a múltiples crews con generación automática de cuotas asociadas.

### Aranceles y Cobranzas
- Definición de listas de precios vigentes por concepto (matrícula, cuotas de crew, clases particulares o paquetes).
- Motor de generación de cargos mensuales y periódicos por alumno.
- Estados de cargo: pendiente, pagado parcial, pagado, vencido o anulado.
- Sistema de descuentos aplicables de forma individual o general.

### Caja y Movimientos
- Apertura y cierre de caja diaria con conciliación de saldo inicial y final.
- Registro de ingresos y egresos categorizados vinculados a transacciones operativas.
- Vistas de historial diario y mensual para balance financiero.

---

## Arquitectura y tecnologías

### Backend
- **Framework:** .NET 10 (ASP.NET Core Web API)
- **Acceso a datos:** Entity Framework Core 10 con proveedor Npgsql (PostgreSQL)
- **Autenticación:** JWT Bearer y Google OAuth (Google.Apis.Auth)
- **Documentación:** OpenAPI integrada con Scalar API Reference
- **Patrón:** Arquitectura orientada a servicios (Controllers, Services con inyección de dependencias, DTOs, Data Context)

### Frontend
- **Librería base:** React 19 con TypeScript
- **Empaquetador y entorno:** Vite 8
- **Enrutamiento:** React Router DOM v7
- **Estilos:** Styled-components y CSS Modules
- **Iconos:** React Icons
- **Calidad de código:** Oxlint y ESLint

### Base de datos
- PostgreSQL 15 o superior

---

## Estructura del proyecto

El repositorio está organizado como un monorepo básico dividido en backend y frontend:

```text
Andromeda Studio/
├── Backend/
│   └── Andromeda.Api/
│       ├── Andromeda.Api.slnx
│       └── Andromeda.Api/
│           ├── Controllers/      # Endpoints HTTP REST
│           ├── Services/         # Lógica de negocio de la aplicación
│           ├── Models/           # Entidades de dominio de EF Core
│           ├── DTOs/             # Objetos de transferencia de datos
│           ├── Data/             # ApplicationDbContext y configuración de entidades
│           ├── Migrations/       # Migraciones de base de datos de EF Core
│           ├── Program.cs        # Punto de entrada y configuración de servicios
│           └── appsettings.json  # Configuración base del backend
└── Frontend/
    ├── src/
    │   ├── app/routes/           # Definición de rutas principales
    │   ├── components/           # Componentes UI reutilizables (tablas, inputs, modales)
    │   ├── features/             # Módulos por dominio (students, crews, payments, cashRegister)
    │   ├── pages/                # Vistas principales (Dashboard, etc.)
    │   └── services/             # Clientes HTTP y llamadas al backend
    ├── package.json
    └── vite.config.ts
```

---

## Requisitos previos

Antes de comenzar, asegurarse de contar con las siguientes herramientas instaladas:

- [.NET 10 SDK](https://dotnet.microsoft.com/)
- [Node.js](https://nodejs.org/) (versión 20 LTS o superior) y npm
- [PostgreSQL](https://www.postgresql.org/) (local o contenedor Docker)
- Herramienta de línea de comandos de Entity Framework Core (opcional para migraciones):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## Puesta en marcha local

### 1. Base de datos

Asegurarse de tener un servidor PostgreSQL en ejecución y crear una base de datos para el proyecto, por ejemplo `AndromedaDb`:

```sql
CREATE DATABASE "AndromedaDb";
```

### 2. Backend (.NET 10 Web API)

1. Navegar a la carpeta del proyecto de API:
   ```bash
   cd "Backend/Andromeda.Api/Andromeda.Api"
   ```

2. Configurar la cadena de conexión y la clave JWT en `appsettings.Development.json` o mediante User Secrets:
   ```bash
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=AndromedaDb;Username=postgres;Password=tu_password"
   dotnet user-secrets set "JwtSettings:SecretKey" "tu_clave_secreta_super_segura_de_al_menos_32_caracteres"
   ```

3. Aplicar las migraciones para crear el esquema en la base de datos:
   ```bash
   dotnet ef database update
   ```

4. Iniciar la aplicación:
   ```bash
   dotnet run
   ```

Por defecto, la API levantará en:
- HTTP: `http://localhost:5039`
- HTTPS: `https://localhost:7137`
- Documentación interactiva (Scalar): `https://localhost:7137/scalar/v1`

### 3. Frontend (React + Vite)

1. En una nueva terminal, situarse en el directorio del frontend:
   ```bash
   cd Frontend
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Verificar o crear el archivo `.env` en la raíz de `Frontend`:
   ```env
   VITE_API_URL=https://localhost:7137
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir el navegador en `http://localhost:5173`.

---

## Configuración de entorno

### Variables del Backend

| Clave | Descripción | Ejemplo / Default |
| --- | --- | --- |
| `ConnectionStrings:DefaultConnection` | Cadena de conexión a PostgreSQL | `Host=localhost;Database=AndromedaDb;...` |
| `JwtSettings:SecretKey` | Clave simétrica para firma y validación de tokens JWT | String aleatorio seguro (mín. 256 bits) |
| `GoogleAuth:ClientId` | Client ID de Google para autenticación federada | `opcional en desarrollo local` |

### Variables del Frontend

| Variable | Descripción | Valor sugerido |
| --- | --- | --- |
| `VITE_API_URL` | URL base del backend expuesto | `https://localhost:7137` |

---

## Documentación de la API

El proyecto incluye soporte nativo para especificación OpenAPI y la interfaz de documentación Scalar.

Con el backend en ejecución en entorno de desarrollo (`ASPNETCORE_ENVIRONMENT=Development`), acceder a:

```text
https://localhost:7137/scalar/v1
```

Desde esta interfaz es posible inspeccionar cada endpoint, visualizar los modelos de datos de entrada y salida, y probar peticiones en tiempo real.
