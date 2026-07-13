# Café Nova

Café Nova es una aplicación web construida con Next.js, TypeScript, Tailwind CSS y Supabase para presentar una marca de café artesanal, gestionar un catálogo público y operar solicitudes de pedido desde un portal administrativo.

El proyecto está pensado como una entrega académica con enfoque profesional: combina sitio público, flujo real de pedidos, autenticación administrativa, panel de gestión, reportes básicos y documentación técnica para facilitar revisión, mantenimiento y despliegue futuro.

## Objetivo

- Presentar una experiencia pública cálida y comercial para Café Nova.
- Mostrar productos activos y destacados usando datos reales desde Supabase.
- Permitir solicitudes de pedido sin pagos en línea.
- Registrar pedidos mediante una RPC segura.
- Administrar pedidos, productos y categorías desde un portal privado.
- Mantener una base clara para publicación en Vercel y evolución del proyecto.

## Stack tecnológico

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase Database
- Supabase Auth
- Supabase Row Level Security
- Supabase RPC
- Recharts
- Lucide React
- Vercel
- GitHub

## Funcionalidades del sitio público

- Landing page pública con branding, hero, historia, valores, productos destacados, beneficios, testimonios y contacto.
- Catálogo público en `/catalogo`.
- Filtros por categorías activas.
- Productos con nombre, descripción, precio, presentación, tipo de café, categoría e imagen.
- Soporte para imágenes internas desde `public/images`.
- Flujo público de pedido en `/pedido`.
- Resumen con cantidades, subtotales y total estimado.
- Validaciones de formulario para nombre, teléfono y correo.
- Confirmación visual después de registrar el pedido.

## Funcionalidades del portal administrativo

- Login administrativo con Supabase Auth.
- Layout privado con navegación, íconos y usuario autenticado.
- Dashboard con KPIs, gráficos y filtros.
- Administración de pedidos con filtros.
- Modal de detalle de pedido.
- Cambio de estado desde el detalle.
- Notas administrativas internas.
- Administración de productos: crear, editar, activar/desactivar, destacar y asignar imagen.
- Administración de categorías: crear, editar y activar/desactivar.
- Cierre de sesión.

## Arquitectura general

- `app/`: rutas públicas y administrativas de Next.js.
- `components/public/`: componentes del sitio público.
- `components/admin/`: componentes del portal administrativo.
- `components/shared/`: espacio para componentes reutilizables.
- `lib/supabase/`: cliente de Supabase.
- `lib/services/`: servicios de acceso a datos por dominio.
- `lib/utils/`: utilidades generales.
- `types/`: tipos TypeScript compartidos.
- `public/images/`: logos, branding, hero e imágenes de productos.
- `docs/`: documentación técnica y operativa.
- `docs/sql/`: scripts SQL documentales.

## Modelo de datos resumido

- `categorias`: categorías del catálogo, con nombre, descripción y estado activo.
- `productos`: productos asociados a categorías, con precio, presentación, tipo de café, imagen, activo y destacado.
- `pedidos`: encabezado del pedido, datos del cliente, estado, total estimado y notas administrativas.
- `pedido_detalle`: productos incluidos en cada pedido, con cantidad, precio unitario y subtotal.
- `profiles`: perfiles administrativos vinculados a usuarios de Supabase Auth.

## Seguridad

Supabase tiene Row Level Security activo. El sitio público solo debe leer productos y categorías activas. Las rutas administrativas requieren sesión autenticada y las políticas RLS validan que el usuario tenga perfil administrativo activo.

El proyecto usa la función `is_admin()` en Supabase para centralizar la validación administrativa en políticas RLS.

## RPC `crear_pedido_publico`

El flujo público de pedido no inserta directamente en `pedidos` ni en `pedido_detalle`. En su lugar llama a la RPC:

```text
crear_pedido_publico
```

La RPC recibe datos del cliente e items con `producto_id` y `cantidad`, calcula el total estimado, genera el código del pedido, guarda el estado inicial `pendiente` y registra el detalle.

## Imágenes y assets

Los assets visuales viven en `public/images/`:

- `public/images/branding/`: logos y monograma.
- `public/images/hero/`: imagen principal del hero.
- `public/images/products/`: imágenes de productos.

En Next.js se referencian como rutas públicas:

```text
/images/products/cafe-nova-molido-250g.png
```

El campo `imagen_url` de productos acepta rutas internas como `/images/...`, URLs externas o valor vacío.

## Instalación local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env.local` usando `.env.local.example` como referencia:

```bash
cp .env.local.example .env.local
```

3. Configurar variables públicas de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Ejecutar el servidor local:

```bash
npm run dev
```

5. Abrir:

```text
http://localhost:3000
```

## Configuración de Supabase

Para preparar la base de datos, usar como referencia principal:

```text
docs/sql/00-cafe-nova-full-setup.sql
```

Ese script maestro documenta el esquema, funciones, políticas RLS y datos base necesarios para levantar el proyecto.

## Usuario administrador

El administrador se gestiona con Supabase Auth y la tabla `profiles`.

Flujo general:

1. Crear el usuario en Supabase Auth.
2. Crear o verificar su registro en `profiles`.
3. Confirmar que tenga `rol = 'admin'`.
4. Confirmar que tenga `activo = true`.

No se deben guardar credenciales reales en el repositorio.

## Comandos principales

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Validación TypeScript:

```bash
npx tsc --noEmit
```

## Despliegue futuro en Vercel

Pasos generales:

1. Conectar el repositorio de GitHub en Vercel.
2. Configurar las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Ejecutar el despliegue.
4. Validar rutas públicas:
   - `/`
   - `/catalogo`
   - `/pedido`
5. Validar login administrativo:
   - `/admin/login`
   - `/admin/dashboard`
6. Confirmar que la URL y anon key correspondan al proyecto correcto de Supabase.

## Documentación

- `docs/architecture.md`: visión técnica del proyecto.
- `docs/qa-checklist.md`: checklist manual de pruebas.
- `docs/sql/00-cafe-nova-full-setup.sql`: script maestro de base de datos.

## Estado actual

El proyecto cuenta con sitio público rediseñado, catálogo, flujo de pedido, integración con Supabase, RPC de creación de pedidos, portal administrativo, dashboard, administración de pedidos, productos y categorías, RLS activo y documentación base.

## Roadmap futuro

- Despliegue en Vercel.
- Pruebas end-to-end.
- Mejoras de accesibilidad.
- Carga de imágenes con Supabase Storage.
- Historial/auditoría de cambios de estado.
- Notificaciones para nuevos pedidos.
- Reportes administrativos más avanzados.

## Aprendizajes principales

- Uso de Next.js con rutas públicas y privadas.
- Integración de Supabase Auth y RLS.
- Diseño de RPC para operaciones públicas controladas.
- Separación de servicios por dominio.
- Manejo de estado local para flujos simples de pedido.
- Construcción de interfaces públicas y administrativas con una misma base técnica.
