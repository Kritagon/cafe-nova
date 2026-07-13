# Arquitectura de Cafe Nova

Cafe Nova es una aplicacion Next.js con TypeScript, Tailwind CSS y Supabase. El proyecto esta dividido entre una experiencia publica para clientes y un portal administrativo protegido.

## Stack

- Next.js para rutas, paginas y renderizado.
- TypeScript para tipos compartidos.
- Tailwind CSS para estilos.
- Supabase para base de datos, autenticacion, RLS y RPC.
- Recharts para graficos administrativos.
- Lucide React para iconografia.
- Vercel como destino natural de despliegue.

## Rutas publicas

- `/`: pagina inicial de Cafe Nova.
- `/catalogo`: catalogo publico de productos activos.
- `/pedido`: flujo de solicitud de pedido.

## Rutas administrativas

- `/admin/login`: inicio de sesion administrativo.
- `/admin/dashboard`: KPIs, graficos, ultimos pedidos y filtros.
- `/admin/pedidos`: listado filtrable de pedidos y modal de detalle.
- `/admin/productos`: administracion de productos.
- `/admin/categorias`: administracion de categorias.

Las rutas bajo `/admin` requieren una sesion activa. El perfil del usuario se consulta desde `profiles` para mostrar informacion administrativa en el layout.

## Supabase

Supabase concentra:

- Tablas de catalogo: `productos` y `categorias`.
- Tablas de pedidos: `pedidos` y `pedido_detalle`.
- Tabla de perfiles administrativos: `profiles`.
- Autenticacion administrativa con Supabase Auth.
- Politicas RLS para separar lectura publica y operaciones administrativas.
- Funcion RPC `crear_pedido_publico` para registrar pedidos publicos.

## Row Level Security

RLS esta activo en las tablas principales. El sitio publico solo debe leer datos activos del catalogo y registrar pedidos mediante la RPC. El portal administrativo opera con usuarios autenticados y politicas que validan perfiles administradores.

## RPC `crear_pedido_publico`

El flujo publico no inserta directamente en `pedidos` ni `pedido_detalle`. En su lugar llama a `crear_pedido_publico` con:

- datos del cliente;
- telefono;
- correo opcional;
- direccion opcional;
- comentarios opcionales;
- items con `producto_id` y `cantidad`.

La RPC crea el pedido, genera el codigo, calcula el total estimado, guarda el estado inicial `pendiente` y registra el detalle.

## Estructura de carpetas

- `app/`: rutas publicas y admin.
- `components/public/`: catalogo, tarjetas, filtros y pedido publico.
- `components/admin/`: dashboard, tablas, formularios, modales y layout admin.
- `components/shared/`: espacio para componentes compartidos.
- `lib/supabase/`: cliente Supabase.
- `lib/services/`: funciones de lectura y escritura por dominio.
- `lib/utils/`: utilidades generales.
- `types/database.ts`: tipos principales de base de datos y formularios.
- `docs/sql/`: scripts SQL documentales.

## Servicios principales

- `productos.service.ts`: productos publicos y administracion de productos.
- `categorias.service.ts`: categorias publicas y administracion de categorias.
- `pedidos.service.ts`: creacion publica de pedidos y operaciones admin de pedidos.
- `dashboard.service.ts`: KPIs, graficos y datos resumidos del dashboard.
- `profiles.service.ts`: perfil del usuario administrativo autenticado.

## Flujo de pedido publico

1. El cliente entra al catalogo.
2. Agrega productos al pedido.
3. Ajusta cantidades en el resumen.
4. Completa datos de contacto.
5. El frontend valida nombre, telefono y correo.
6. El servicio llama a la RPC `crear_pedido_publico`.
7. Supabase crea el pedido y devuelve codigo, id y total estimado.
8. La interfaz muestra una confirmacion al cliente.

## Flujo administrativo

1. El administrador inicia sesion en `/admin/login`.
2. El layout admin protege rutas y muestra navegacion.
3. El dashboard resume la operacion con KPIs y graficos.
4. En pedidos, el admin filtra solicitudes y abre el detalle en modal.
5. Desde el modal puede revisar productos, cambiar estado y guardar notas internas.
6. En productos, puede crear, editar, destacar y activar/desactivar productos.
7. En categorias, puede crear, editar y activar/desactivar categorias.
