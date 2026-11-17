# 🎪 Circus Tours — Plataforma de Gestión y Reservas de Viajes

Sistema integral de agencia de viajes para eventos, recitales y turismo con panel administrativo, pasajes digitales con código QR y almacenamiento de imágenes en Vercel Blob. Réplica moderna y optimizada inspirada en MiReserva.

---

## 🚀 Características Principales

### 🌐 Portal Público para Clientes
- **Homepage:** Hero dinámico, próximas salidas destacadas, salidas de turismo, testimonios y llamadas a la acción.
- **Eventos & Recitales (`/eventos`):** Catálogo de viajes a shows (con fecha, punto de partida, precio y tipo de micro).
- **Detalle de Salida (`/eventos/[slug]`):** Ficha técnica completa, cronograma, puntos de embarque con horarios, qué incluye y formulario de reserva interactivo.
- **Turismo & Escapadas (`/turismo` y `/turismo/[slug]`):** Salidas en formato afiche (aspecto 4:5) para fines de semana y excursiones.
- **Quiénes Somos (`/nosotros`):** Historia de la agencia, grilla bento de 7 pilares de servicio y galería de comunidad.
- **Contacto (`/contacto`):** Acceso directo a WhatsApp oficial, llamadas telefónicas, Instagram y mapa interactivo de Google Maps.
- **Pasaje Digital con QR (`/pasaje/[code]`):** Tarjeta de embarque digital con código QR generado en tiempo real para control de acceso y abordaje de pasajeros.
- **Botones Flotantes:** Acceso instantáneo a WhatsApp e Instagram desde cualquier sección.

### 🔐 Panel Administrativo (`/admin`)
- **Acceso seguro:** Login privado con autenticación JWT y contraseñas hasheadas (`bcryptjs`).
- **Dashboard:** Métricas en tiempo real de reservas, recaudación acumulada, pasajeros a bordo y eventos activos.
- **Gestión de Eventos & Turismo:** CRUD completo para crear, editar, pausar y eliminar viajes con puntos de encuentro múltiples y servicios incluidos.
- **Carga de Imágenes con Vercel Blob:** Subida directa de imágenes con `@vercel/blob` para fotos de portada y afiches.
- **Gestión de Reservas:** Visualización de todas las reservas, filtro por estado de pago (PAGADO, PENDIENTE, PARCIAL, CANCELADO), asignación de butacas y acceso directo a cada Pasaje QR.
- **Directorio de Clientes:** Listado unificado de pasajeros con historial de viajes, total invertido y acceso directo a chat de WhatsApp.
- **Configuración del Negocio:** Editor en vivo para modificar nombre, eslogan, logo, foto de portada, color primario (con selector de color), datos de contacto y datos bancarios (Alias, CBU, Titular).

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components y Server Actions)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + CSS Variables para personalización de tema
- **Base de Datos:** [PostgreSQL en Neon Serverless](https://neon.tech/)
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Almacenamiento de Archivos:** [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) (`@vercel/blob`)
- **Códigos QR:** [QRCode.js](https://github.com/soldair/node-qrcode)
- **Iconografía:** [Lucide React](https://lucide.dev/)

---

## 🔑 Credenciales Iniciales de Administración

Una vez inicializada la base de datos, podés acceder al panel administrativo en:
- **URL:** `/admin/login`
- **Email:** `admin@circustours.com`
- **Contraseña:** `admin123`

---

## ⚙️ Variables de Entorno (`.env`)

```env
# Neon PostgreSQL Database
DATABASE_URL="postgresql://neondb_owner:npg_HWGm8J1evZxO@ep-aged-surf-bdwmhh1c-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Clave secreta para tokens de sesión admin
JWT_SECRET="circus-tours-super-secret-jwt-key-2026-production"

# Vercel Blob Storage Token (se conecta automáticamente en Vercel)
BLOB_READ_WRITE_TOKEN=""

# URL pública de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚢 Despliegue en Vercel

1. **Importar el Repositorio:**
   - Conectá el repositorio en [Vercel Dashboard](https://vercel.com/).
2. **Configurar Variables de Entorno:**
   - Agregá `DATABASE_URL` y `JWT_SECRET`.
3. **Conectar Vercel Blob:**
   - En la pestaña **Storage** de tu proyecto en Vercel, creá un store de **Blob** y enlazalo al proyecto. Vercel inyectará automáticamente `BLOB_READ_WRITE_TOKEN`.
4. **Deploy:**
   - El script `npm run build` ejecutará automáticamente `prisma generate` y creará el build optimizado de Next.js.

