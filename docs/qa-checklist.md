# Checklist QA manual

Este checklist ayuda a validar manualmente Cafe Nova antes de hacer commit, publicar o entregar una version.

## Pagina principal

- [ ] La ruta `/` carga sin errores.
- [ ] Se muestra el nombre Cafe Nova.
- [ ] Hay una frase principal y texto de presentacion.
- [ ] Existe un enlace visible hacia `/catalogo`.
- [ ] La seccion de productos destacados no rompe si no hay productos.

## Catalogo publico

- [ ] La ruta `/catalogo` carga productos activos desde Supabase.
- [ ] Los productos inactivos no aparecen.
- [ ] Cada producto muestra nombre, descripcion, precio, presentacion y tipo de cafe.
- [ ] La categoria se muestra cuando existe.
- [ ] La imagen se muestra si `imagen_url` existe.
- [ ] Se muestra un placeholder visual si no hay imagen.
- [ ] El diseno responde bien en escritorio y movil.

## Filtro por categorias

- [ ] La opcion `Todos` muestra todos los productos activos.
- [ ] Cada categoria activa aparece como opcion.
- [ ] Las categorias inactivas no aparecen.
- [ ] El filtro cambia la lista sin errores visuales.

## Pedido publico

- [ ] Se pueden agregar productos al pedido.
- [ ] La cantidad no baja de 1.
- [ ] Se puede modificar cantidad desde el resumen.
- [ ] Se puede eliminar un producto del resumen.
- [ ] El subtotal y total estimado se calculan correctamente.
- [ ] No se puede enviar un pedido vacio.

## Validaciones del formulario

- [ ] `nombre_cliente` es obligatorio.
- [ ] `nombre_cliente` exige al menos 2 caracteres despues de trim.
- [ ] `telefono` es obligatorio.
- [ ] `telefono` acepta exactamente 8 digitos.
- [ ] `telefono` rechaza letras, espacios, guiones y simbolos.
- [ ] `correo` es opcional.
- [ ] `correo` rechaza formato invalido si se escribe.
- [ ] No se llama a Supabase cuando hay errores de validacion.
- [ ] Un pedido valido se registra correctamente.

## Login administrativo

- [ ] `/admin/login` carga correctamente.
- [ ] Un usuario invalido muestra error claro.
- [ ] Un administrador valido inicia sesion.
- [ ] Un usuario no autenticado no puede entrar a rutas admin.
- [ ] El cierre de sesion redirige a `/admin/login`.

## Dashboard

- [ ] `/admin/dashboard` carga con sesion administrativa.
- [ ] Los KPIs se muestran correctamente.
- [ ] Los graficos de Recharts se renderizan.
- [ ] La tabla de ultimos pedidos aparece.
- [ ] Los filtros no se aplican hasta presionar `Filtrar`.
- [ ] `Limpiar` devuelve el dashboard a todos los datos.
- [ ] Fecha desde, fecha hasta y estado afectan KPIs y graficos.

## Pedidos administrativos

- [ ] `/admin/pedidos` muestra pedidos ordenados por fecha descendente.
- [ ] Los filtros no se aplican automaticamente.
- [ ] El filtro por estado funciona.
- [ ] El filtro por fecha desde funciona.
- [ ] El filtro por fecha hasta funciona.
- [ ] La busqueda encuentra por codigo, cliente, telefono o correo.
- [ ] `Limpiar` restaura la lista completa.
- [ ] La tabla muestra codigo, cliente, telefono, estado, total, fecha y accion.
- [ ] El estado se muestra como badge.
- [ ] No existe selector de estado directamente en la tabla.

## Detalle de pedido

- [ ] `Ver detalle` abre el modal del pedido.
- [ ] El modal muestra datos del cliente.
- [ ] El modal muestra direccion y comentarios del cliente.
- [ ] El modal muestra productos, cantidades, precios y subtotales.
- [ ] El modal permite cambiar estado.
- [ ] El modal permite editar `notas_admin`.
- [ ] `Guardar cambios` actualiza estado y notas.
- [ ] La tabla se refresca y el badge muestra el nuevo estado.

## Productos administrativos

- [ ] `/admin/productos` carga productos activos e inactivos.
- [ ] Se puede crear un producto.
- [ ] Se validan nombre, categoria, precio, presentacion y tipo de cafe.
- [ ] Se puede editar un producto.
- [ ] Se puede activar y desactivar un producto.
- [ ] Un producto inactivo deja de aparecer en el catalogo publico.
- [ ] El precio se muestra con formato CRC.
- [ ] Las categorias activas aparecen en el formulario.

## Categorias administrativas

- [ ] `/admin/categorias` carga categorias activas e inactivas.
- [ ] Se puede crear una categoria.
- [ ] Se valida nombre obligatorio y minimo 2 caracteres.
- [ ] Se puede editar una categoria.
- [ ] Se puede activar y desactivar una categoria.
- [ ] Una categoria inactiva deja de aparecer en el filtro publico.
- [ ] El formulario se abre en modal.

## RLS basico

- [ ] La lectura publica solo muestra productos activos.
- [ ] La lectura publica solo muestra categorias activas.
- [ ] La RPC `crear_pedido_publico` permite registrar pedidos publicos validos.
- [ ] Un usuario no autenticado no puede administrar pedidos, productos o categorias.
- [ ] Un administrador autenticado puede leer y actualizar pedidos.
- [ ] Un administrador autenticado puede administrar productos y categorias.
