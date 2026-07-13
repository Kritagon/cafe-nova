-- =========================================================
-- Proyecto: Café Nova
-- RLS inicial para MVP
-- =========================================================

-- 1. Activar Row Level Security
alter table public.profiles enable row level security;
alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_detalle enable row level security;

-- 2. Función auxiliar para validar administrador
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and rol = 'admin'
      and activo = true
  );
$$;

-- 3. Lectura pública de categorías activas
create policy "Public can read active categorias"
on public.categorias
for select
to anon, authenticated
using (activo = true);

-- 4. Lectura pública de productos activos
create policy "Public can read active productos"
on public.productos
for select
to anon, authenticated
using (activo = true);

-- 5. Inserción pública de pedidos
create policy "Public can create pedidos"
on public.pedidos
for insert
to anon, authenticated
with check (estado = 'pendiente');

-- 6. Inserción pública de detalle de pedidos
create policy "Public can create pedido_detalle"
on public.pedido_detalle
for insert
to anon, authenticated
with check (true);

-- 7. Lectura administrativa de pedidos
create policy "Admins can read pedidos"
on public.pedidos
for select
to authenticated
using (public.is_admin());

-- 8. Actualización administrativa de pedidos
create policy "Admins can update pedidos"
on public.pedidos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 9. Lectura administrativa de detalle de pedidos
create policy "Admins can read pedido_detalle"
on public.pedido_detalle
for select
to authenticated
using (public.is_admin());

-- 10. Administración de categorías
create policy "Admins can insert categorias"
on public.categorias
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update categorias"
on public.categorias
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete categorias"
on public.categorias
for delete
to authenticated
using (public.is_admin());

-- 11. Administración de productos
create policy "Admins can insert productos"
on public.productos
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update productos"
on public.productos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete productos"
on public.productos
for delete
to authenticated
using (public.is_admin());

-- 12. Lectura administrativa de perfiles
create policy "Admins can read profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

