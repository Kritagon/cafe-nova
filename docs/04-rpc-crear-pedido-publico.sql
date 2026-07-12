create or replace function public.crear_pedido_publico(
  p_nombre_cliente text,
  p_telefono text,
  p_correo text,
  p_direccion text,
  p_comentarios text,
  p_items jsonb
)
returns table (
  pedido_id bigint,
  codigo_pedido text,
  total_estimado numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido_id bigint;
  v_codigo_pedido text;
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_producto record;
  v_cantidad integer;
  v_subtotal numeric(10,2);
begin
  -- Validaciones básicas
  if p_nombre_cliente is null or length(trim(p_nombre_cliente)) = 0 then
    raise exception 'El nombre del cliente es obligatorio';
  end if;

  if p_telefono is null or length(trim(p_telefono)) = 0 then
    raise exception 'El teléfono es obligatorio';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido debe tener al menos un producto';
  end if;

  -- Generar código visible del pedido
  v_codigo_pedido := 'CN-' || to_char(now(), 'YYYYMMDD-HH24MISS');

  -- Crear encabezado del pedido
  insert into public.pedidos (
    codigo_pedido,
    nombre_cliente,
    telefono,
    correo,
    direccion,
    comentarios,
    estado,
    total_estimado
  )
  values (
    v_codigo_pedido,
    trim(p_nombre_cliente),
    trim(p_telefono),
    nullif(trim(coalesce(p_correo, '')), ''),
    nullif(trim(coalesce(p_direccion, '')), ''),
    nullif(trim(coalesce(p_comentarios, '')), ''),
    'pendiente',
    0
  )
  returning id into v_pedido_id;

  -- Insertar detalle
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_cantidad := coalesce((v_item->>'cantidad')::integer, 0);

    if v_cantidad <= 0 then
      raise exception 'La cantidad debe ser mayor a cero';
    end if;

    select
      id,
      nombre,
      precio
    into v_producto
    from public.productos
    where id = (v_item->>'producto_id')::bigint
      and activo = true;

    if not found then
      raise exception 'Producto no encontrado o inactivo';
    end if;

    v_subtotal := v_producto.precio * v_cantidad;
    v_total := v_total + v_subtotal;

    insert into public.pedido_detalle (
      pedido_id,
      producto_id,
      nombre_producto,
      precio_unitario,
      cantidad,
      subtotal
    )
    values (
      v_pedido_id,
      v_producto.id,
      v_producto.id,
      v_producto.precio,
      v_cantidad,
      v_subtotal
    );
  end loop;

  -- Actualizar total del pedido
  update public.pedidos
  set total_estimado = v_total
  where id = v_pedido_id;

  return query
  select
    v_pedido_id,
    v_codigo_pedido,
    v_total;
end;
$$;

grant execute on function public.crear_pedido_publico(
  text,
  text,
  text,
  text,
  text,
  jsonb
) to anon, authenticated;

create or replace function public.crear_pedido_publico(
  p_nombre_cliente text,
  p_telefono text,
  p_correo text,
  p_direccion text,
  p_comentarios text,
  p_items jsonb
)
returns table (
  pedido_id bigint,
  codigo_pedido text,
  total_estimado numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido_id bigint;
  v_codigo_pedido text;
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_producto record;
  v_cantidad integer;
  v_subtotal numeric(10,2);
begin
  if p_nombre_cliente is null or length(trim(p_nombre_cliente)) = 0 then
    raise exception 'El nombre del cliente es obligatorio';
  end if;

  if p_telefono is null or length(trim(p_telefono)) = 0 then
    raise exception 'El teléfono es obligatorio';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido debe tener al menos un producto';
  end if;

  v_codigo_pedido := 'CN-' || to_char(now(), 'YYYYMMDD-HH24MISS');

  insert into public.pedidos (
    codigo_pedido,
    nombre_cliente,
    telefono,
    correo,
    direccion,
    comentarios,
    estado,
    total_estimado
  )
  values (
    v_codigo_pedido,
    trim(p_nombre_cliente),
    trim(p_telefono),
    nullif(trim(coalesce(p_correo, '')), ''),
    nullif(trim(coalesce(p_direccion, '')), ''),
    nullif(trim(coalesce(p_comentarios, '')), ''),
    'pendiente',
    0
  )
  returning id into v_pedido_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_cantidad := coalesce((v_item->>'cantidad')::integer, 0);

    if v_cantidad <= 0 then
      raise exception 'La cantidad debe ser mayor a cero';
    end if;

    select
      id,
      nombre,
      precio
    into v_producto
    from public.productos
    where id = (v_item->>'producto_id')::bigint
      and activo = true;

    if not found then
      raise exception 'Producto no encontrado o inactivo';
    end if;

    v_subtotal := v_producto.precio * v_cantidad;
    v_total := v_total + v_subtotal;

    insert into public.pedido_detalle (
      pedido_id,
      producto_id,
      nombre_producto,
      precio_unitario,
      cantidad,
      subtotal
    )
    values (
      v_pedido_id,
      v_producto.id,
      v_producto.nombre,
      v_producto.precio,
      v_cantidad,
      v_subtotal
    );
  end loop;

  update public.pedidos
  set total_estimado = v_total
  where id = v_pedido_id;

  return query
  select
    v_pedido_id,
    v_codigo_pedido,
    v_total;
end;
$$;

grant execute on function public.crear_pedido_publico(
  text,
  text,
  text,
  text,
  text,
  jsonb
) to anon, authenticated;