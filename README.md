# Cafe Nova

Cafe Nova es una aplicacion web para gestionar el catalogo publico y el flujo de pedidos de una cafeteria. El proyecto combina una experiencia publica simple para clientes con un portal administrativo para operar pedidos, productos, categorias y reportes basicos.

## Objetivos

- Mostrar un catalogo publico de productos activos.
- Permitir que clientes creen solicitudes de pedido sin login.
- Registrar pedidos de forma segura en Supabase mediante una RPC publica controlada.
- Entregar un portal administrativo privado para revisar pedidos y mantener catalogo.
- Mantener una base clara para publicar en Vercel y continuar el desarrollo.

## Stack tecnologico

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth
- Supabase RLS
- Recharts
- Lucide React
- Vercel
- GitHub

## Funcionalidades publicas

- Pagina principal publica.
- Catalogo publico en `/catalogo`.
- Filtro por categorias activas.
- Tarjetas de producto con nombre, descripcion, precio, presentacion, tipo de cafe, categoria e imagen opcional.
- Flujo de pedido publico.
- Resumen de pedido con cantidades, subtotales y total estimado.
- Formulario de cliente con validaciones de nombre, telefono y correo.
- Confirmacion visual despues de registrar una solicitud.

## Portal administrativo

- Login administrativo con Supabase Auth.
- Layout administrativo protegido.
- Navegacion con enlaces a dashboard, pedidos, productos y categorias.
- Usuario autenticado visible en el encabezado.
- Dashboard con KPIs, graficos y filtros por fecha y estado.
- Administracion de pedidos con filtros, detalle en modal, notas internas y cambio de estado.
- Administracion de productos con crear, editar, activar/desactivar, destacado e imagen URL.
- Administracion de categorias con crear, editar y activar/desactivar.

## Arquitectura general

- `app/`: rutas publicas y administrativas de Next.js.
- `components/public/`: componentes del sitio publico.
- `components/admin/`: componentes del portal administrativo.
- `components/shared/`: espacio para componentes reutilizables.
- `lib/supabase/`: cliente de Supabase.
- `lib/services/`: servicios de acceso a datos por dominio.
- `lib/utils/`: utilidades generales.
- `types/`: tipos TypeScript compartidos.
- `docs/`: documentacion tecnica y operativa.
- `docs/sql/`: scripts SQL documentales del proyecto.

## Modelo de datos resumido

- `categorias`: categorias del catalogo, con nombre, descripcion y estado activo.
- `productos`: productos asociados a categorias, con precio, presentacion, tipo de cafe, imagen URL, activo y destacado.
- `pedidos`: encabezado de solicitudes de pedido, datos del cliente, estado, total estimado y notas administrativas.
- `pedido_detalle`: productos incluidos en cada pedido, cantidad, precio unitario y subtotal.
- `profiles`: perfiles administrativos vinculados a Supabase Auth.

## Seguridad

Supabase tiene Row Level Security activo. La lectura publica se limita a productos y categorias activas. Las operaciones administrativas dependen de una sesion autenticada y de politicas RLS basadas en perfiles administradores.

El registro publico de pedidos usa la RPC `crear_pedido_publico`, evitando insertar manualmente desde el cliente en `pedidos` y `pedido_detalle`. La RPC recibe datos del cliente e items con `producto_id` y `cantidad`, calcula totales y crea el pedido con estado inicial `pendiente`.

## Instalacion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env.local` a partir de `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Completar las variables publicas de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Ejecutar el servidor local:

```bash
npm run dev
```

5. Abrir la aplicacion:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Para validar TypeScript:

```bash
npx tsc --noEmit
```

## Documentacion SQL

Los scripts documentales viven en `docs/sql/`:

- `01-schema.sql`: esquema base.
- `02-seed-data.sql`: datos iniciales.
- `03-rls-policies.sql`: politicas RLS.
- `04-rpc-crear-pedido-publico.sql`: RPC de creacion de pedidos publicos.
- `05-fix-rls-productos-admin.sql`: ajuste documental para administracion de productos.
- `rls-inicial.sql`: referencia inicial de politicas.

## Estado actual

El proyecto cuenta con sitio publico, catalogo, flujo de pedidos, portal administrativo, dashboard, filtros, pedidos con detalle y notas, administracion de productos y administracion de categorias. La conexion con Supabase y RLS ya esta integrada.

## Roadmap futuro

- Publicacion en Vercel.
- Mejoras de accesibilidad y pruebas end-to-end.
- Gestion de imagenes con Supabase Storage.
- CRUD administrativo mas avanzado para productos y categorias.
- Reportes administrativos mas detallados.
- Notificaciones o seguimiento operativo de pedidos.
- Mejoras de auditoria para cambios de estado.

## Aprendizaje del proyecto

Cafe Nova sirve como base practica para construir una aplicacion real con Next.js, TypeScript y Supabase. El proyecto cubre patrones utiles como rutas publicas y privadas, RLS, RPC para operaciones controladas, servicios tipados, componentes de UI reutilizables y preparacion para despliegue en Vercel.
