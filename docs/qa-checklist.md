# Checklist QA manual

Usar este checklist antes de hacer commit, entregar una versión académica o preparar despliegue.

## Sitio público

### Home

- [ ] `/` carga sin errores.
- [ ] El header público muestra la marca Café Nova.
- [ ] La navegación apunta a Inicio, Historia, Productos, Beneficios, Pedido y Contacto.
- [ ] El hero muestra texto principal, botones e imagen.
- [ ] Los botones `Ver catálogo` y `Hacer pedido` funcionan.
- [ ] La sección de historia se visualiza correctamente.
- [ ] Misión, visión y valores se muestran sin romper responsive.
- [ ] Productos destacados cargan desde Supabase.
- [ ] Si no hay destacados, se muestran productos activos o un estado amable.
- [ ] Testimonios y contacto se muestran correctamente.
- [ ] El footer se ve bien en escritorio y móvil.

### Navegación

- [ ] Desde el header se puede volver al inicio.
- [ ] Los enlaces hacia `/catalogo` funcionan.
- [ ] Los enlaces hacia `/pedido` funcionan.
- [ ] Los anchors internos de la landing no rompen la navegación.

### Catálogo

- [ ] `/catalogo` carga sin errores.
- [ ] Se muestran productos activos desde Supabase.
- [ ] Los productos inactivos no aparecen.
- [ ] Las categorías activas aparecen en filtros.
- [ ] Las categorías inactivas no aparecen.
- [ ] El filtro `Todos` muestra todos los productos activos.
- [ ] Cada filtro de categoría actualiza la lista.
- [ ] Las tarjetas muestran nombre, descripción, precio, presentación y tipo de café.
- [ ] Las tarjetas muestran categoría cuando existe.
- [ ] Las tarjetas usan `imagen_url` si existe.
- [ ] Las rutas internas `/images/products/...` renderizan correctamente.
- [ ] El estado vacío se muestra si una categoría no tiene productos.

### Pedido público

- [ ] Se puede agregar un producto al pedido.
- [ ] Se puede incrementar cantidad.
- [ ] La cantidad no baja de 1.
- [ ] Se puede eliminar un producto del resumen.
- [ ] El subtotal se calcula correctamente.
- [ ] El total estimado se calcula correctamente.
- [ ] No se puede enviar un pedido vacío.

### Formulario y validaciones

- [ ] `nombre_cliente` es obligatorio.
- [ ] `nombre_cliente` exige mínimo 2 caracteres después de trim.
- [ ] `telefono` es obligatorio.
- [ ] `telefono` acepta exactamente 8 dígitos.
- [ ] `telefono` rechaza letras, guiones, espacios y símbolos.
- [ ] `correo` es opcional.
- [ ] `correo` valida formato si se escribe.
- [ ] Dirección es opcional.
- [ ] Comentarios es opcional.
- [ ] No se llama a Supabase si hay errores.
- [ ] Un pedido válido muestra confirmación.
- [ ] El pedido válido queda registrado en Supabase.

## Admin

### Login y logout

- [ ] `/admin/login` carga correctamente.
- [ ] Credenciales inválidas muestran error claro.
- [ ] Un administrador válido inicia sesión.
- [ ] Las rutas admin redirigen a login si no hay sesión.
- [ ] El botón de cerrar sesión funciona.

### Dashboard

- [ ] `/admin/dashboard` carga con sesión administrativa.
- [ ] Los KPIs se muestran.
- [ ] Los gráficos de Recharts renderizan.
- [ ] La tabla de últimos pedidos aparece.
- [ ] Los filtros no se aplican automáticamente.
- [ ] El botón `Filtrar` actualiza datos.
- [ ] El botón `Limpiar` restaura filtros.
- [ ] Fecha desde, fecha hasta y estado afectan los datos.

### Pedidos

- [ ] `/admin/pedidos` carga pedidos.
- [ ] Los pedidos aparecen ordenados por fecha descendente.
- [ ] El filtro por fecha desde funciona.
- [ ] El filtro por fecha hasta funciona.
- [ ] El filtro por estado funciona.
- [ ] La búsqueda encuentra por código, cliente, teléfono o correo.
- [ ] La tabla muestra código, cliente, teléfono, estado, total, fecha y acción.
- [ ] El estado se muestra como badge.
- [ ] No hay selector de estado directo en la tabla.

### Detalle de pedido

- [ ] `Ver detalle` abre el modal.
- [ ] El modal muestra datos del cliente.
- [ ] El modal muestra dirección y comentarios.
- [ ] El modal muestra productos, cantidades, precios y subtotales.
- [ ] El modal permite cambiar estado.
- [ ] El modal permite editar `notas_admin`.
- [ ] `Guardar cambios` actualiza estado y notas.
- [ ] La tabla refresca el badge de estado.

### Productos

- [ ] `/admin/productos` carga productos activos e inactivos.
- [ ] Se puede crear producto.
- [ ] Se puede editar producto.
- [ ] Se puede activar/desactivar producto.
- [ ] Se puede marcar/desmarcar destacado.
- [ ] Se validan nombre, categoría, precio, presentación y tipo de café.
- [ ] `imagen_url` permite campo vacío.
- [ ] `imagen_url` permite URL externa.
- [ ] `imagen_url` permite ruta interna `/images/products/...`.
- [ ] Productos inactivos no aparecen en el catálogo público.

### Categorías

- [ ] `/admin/categorias` carga categorías activas e inactivas.
- [ ] Se puede crear categoría.
- [ ] Se puede editar categoría.
- [ ] Se puede activar/desactivar categoría.
- [ ] Se valida nombre obligatorio.
- [ ] Se valida mínimo 2 caracteres.
- [ ] Categorías inactivas no aparecen en filtros públicos.

## Seguridad

- [ ] `.env.local` no aparece en cambios de Git.
- [ ] No hay claves reales en README ni docs.
- [ ] RLS está activo en Supabase.
- [ ] Existe usuario admin en Supabase Auth.
- [ ] El usuario admin tiene registro en `profiles`.
- [ ] El profile admin tiene `rol = 'admin'`.
- [ ] El profile admin tiene `activo = true`.
- [ ] Usuarios no autenticados no pueden entrar al admin.
- [ ] Productos inactivos no son públicos.
- [ ] Categorías inactivas no son públicas.
- [ ] La RPC `crear_pedido_publico` registra pedidos públicos válidos.

## SQL y despliegue

- [ ] Existe `docs/sql/00-cafe-nova-full-setup.sql`.
- [ ] El README indica que el script maestro es el principal.
- [ ] `.env.local.example` contiene las variables necesarias.
- [ ] En Vercel se configuran `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Después de desplegar, validar `/`, `/catalogo`, `/pedido` y `/admin/login`.
