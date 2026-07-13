# Arquitectura de Café Nova

Este documento resume la arquitectura de Café Nova para facilitar revisión, mantenimiento y preparación de despliegue.

## Visión general

Café Nova es una aplicación web con dos áreas principales:

- Sitio público: presenta la marca, muestra el catálogo y permite registrar solicitudes de pedido.
- Portal administrativo: permite iniciar sesión, consultar pedidos, actualizar estados, registrar notas internas y administrar productos y categorías.

La aplicación usa Supabase como backend principal para base de datos, autenticación, políticas RLS y RPC.

## Stack

- Next.js para rutas y renderizado.
- React para componentes.
- TypeScript para tipos.
- Tailwind CSS para estilos.
- Supabase Database para persistencia.
- Supabase Auth para login administrativo.
- Supabase RLS para seguridad por fila.
- Supabase RPC para crear pedidos públicos.
- Recharts para gráficos del dashboard.
- Lucide React para íconos.
- Vercel como destino de despliegue futuro.

## Rutas públicas

- `/`: landing pública de Café Nova.
- `/catalogo`: catálogo público con filtros por categoría.
- `/pedido`: flujo público para armar y enviar una solicitud de pedido.

## Rutas administrativas

- `/admin/login`: inicio de sesión.
- `/admin/dashboard`: KPIs, gráficos, filtros y últimos pedidos.
- `/admin/pedidos`: listado de pedidos, filtros y detalle en modal.
- `/admin/productos`: gestión de productos.
- `/admin/categorias`: gestión de categorías.

Las rutas administrativas están protegidas por sesión activa. El perfil administrativo se consulta desde `profiles`.

## Estructura de carpetas

- `app/`: páginas y rutas.
- `components/public/`: componentes del sitio público.
- `components/admin/`: componentes del portal administrativo.
- `components/shared/`: componentes reutilizables.
- `lib/services/`: acceso a datos y operaciones por dominio.
- `lib/supabase/`: cliente de Supabase.
- `types/database.ts`: tipos principales de datos.
- `public/images/`: imágenes públicas del proyecto.
- `docs/`: documentación.
- `docs/sql/`: scripts SQL.

## Servicios principales

- `productos.service.ts`: productos públicos, destacados y administración de productos.
- `categorias.service.ts`: categorías públicas y administración de categorías.
- `pedidos.service.ts`: creación pública de pedidos y operaciones administrativas.
- `dashboard.service.ts`: KPIs y datos para gráficos.
- `profiles.service.ts`: perfil del usuario autenticado.

## Flujo de pedido público

1. El usuario entra a `/catalogo` o `/pedido`.
2. Agrega productos al pedido.
3. Ajusta cantidades.
4. Completa datos de contacto.
5. El frontend valida nombre, teléfono y correo.
6. El servicio `crearPedido()` llama a la RPC `crear_pedido_publico`.
7. Supabase crea el pedido y su detalle.
8. La interfaz muestra confirmación al usuario.

No hay pagos en línea. El pedido queda sujeto a confirmación manual.

## Flujo administrativo

1. El administrador inicia sesión en `/admin/login`.
2. El layout administrativo valida sesión.
3. El dashboard muestra indicadores y gráficos.
4. En pedidos, el administrador filtra, abre detalle, cambia estado y edita `notas_admin`.
5. En productos, puede crear, editar, destacar y activar/desactivar productos.
6. En categorías, puede crear, editar y activar/desactivar categorías.
7. El administrador puede cerrar sesión.

## Supabase

Supabase concentra:

- Base de datos relacional.
- Autenticación administrativa.
- Políticas RLS.
- RPC para creación de pedidos públicos.
- Función `is_admin()` para validar perfiles administrativos.

## Row Level Security

RLS protege las tablas principales. El sitio público solo debe acceder a datos activos y a la RPC pública de creación de pedidos. Las operaciones administrativas requieren usuario autenticado con perfil activo y rol administrativo.

## RPC `crear_pedido_publico`

La RPC recibe:

- nombre del cliente;
- teléfono;
- correo opcional;
- dirección opcional;
- comentarios opcionales;
- items con `producto_id` y `cantidad`.

La función crea el encabezado en `pedidos`, registra `pedido_detalle`, calcula `total_estimado`, genera `codigo_pedido` y deja el estado inicial como `pendiente`.

## Modelo de datos

- `categorias`: define agrupaciones del catálogo.
- `productos`: representa productos vendibles.
- `pedidos`: guarda la solicitud principal.
- `pedido_detalle`: guarda productos y cantidades del pedido.
- `profiles`: guarda información administrativa del usuario autenticado.

## Imágenes

Las imágenes del proyecto viven en:

```text
public/images/
```

Estructura:

- `branding/`: logos y monograma.
- `hero/`: imagen principal de la landing.
- `products/`: imágenes de productos.

Desde la aplicación se usan con rutas públicas como:

```text
/images/products/cafe-nova-molido-250g.png
```

## SQL

El script maestro principal es:

```text
docs/sql/00-cafe-nova-full-setup.sql
```

No se ejecuta desde la aplicación. Es documentación y guía para preparar Supabase.

## Despliegue futuro en Vercel

Para desplegar:

1. Conectar el repositorio en Vercel.
2. Configurar variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Desplegar.
4. Validar `/`, `/catalogo`, `/pedido` y rutas admin.
5. Confirmar que Supabase Auth y RLS funcionen en producción.
