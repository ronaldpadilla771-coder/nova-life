# Nova Life

Aplicación todo en uno para organizar tu vida: objetivos, hábitos, diario, tareas, finanzas y estadísticas, con un diseño premium en modo oscuro.

## Stack

- Next.js 15 (App Router) + React + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Framer Motion
- React Hook Form + Zod
- Recharts
- Lucide React

## 1. Instalación

```bash
npm install
```

## 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql). Esto crea todas las tablas, las políticas de Row Level Security y el trigger que genera el perfil automáticamente al registrarse.
3. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public key`
4. Duplica `.env.local.example` como `.env.local` y rellena las variables:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica
```

5. (Opcional) En **Authentication → Providers**, confirma que el proveedor de **Email** esté activado. Por defecto Supabase exige confirmación por correo antes de iniciar sesión; puedes desactivarlo en desarrollo desde **Authentication → Settings**.

## 3. Ejecutar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 4. Estructura del proyecto

```
app/
  (auth)/login, (auth)/register        → Autenticación
  (app)/dashboard                      → Resumen general
  (app)/objetivos                      → Objetivos anuales/mensuales/semanales
  (app)/habitos                        → Hábitos, rachas y calendario
  (app)/diario                         → Entradas diarias, ánimo, aprendizajes
  (app)/tareas                         → Tareas con prioridad y recordatorios
  (app)/finanzas                       → Ingresos, gastos, ahorros y meta
  (app)/estadisticas                   → Gráficos de productividad y rachas
  (app)/configuracion                  → Perfil y preferencias
components/
  ui/          → Componentes base reutilizables (botón, tarjeta, modal...)
  layout/      → Sidebar, navegación móvil, topbar
  dashboard/, goals/, habits/, journal/, tasks/, finance/, stats/
lib/
  supabase/    → Clientes de Supabase (browser, server, middleware)
  validations.ts → Esquemas Zod
  utils.ts, quotes.ts
types/database.ts → Tipos TypeScript del esquema
supabase/schema.sql → Esquema SQL completo con RLS
```

## 5. Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com): conecta el repositorio y añade las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en la configuración del proyecto.

## Notas

- Todas las tablas tienen Row Level Security activado: cada usuario solo puede leer y modificar sus propios datos.
- El registro crea automáticamente una fila en `profiles` mediante un trigger de Postgres.
- El modo oscuro está activado permanentemente (es el único modo del producto, tal como se definió en el diseño).
