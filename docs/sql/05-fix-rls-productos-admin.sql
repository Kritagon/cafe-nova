-- =========================================================
-- Café Nova - Ajuste RLS productos
-- Permite que admin gestione productos activos e inactivos
-- =========================================================

drop policy if exists "Public can read active productos"
on public.productos;

drop policy if exists "Admins can read productos"
on public.productos;

drop policy if exists "Admins can insert productos"
on public.productos;

drop policy if exists "Admins can update productos"
on public.productos;

drop policy if exists "Admins can delete productos"
on public.productos;

drop policy if exists "Admins can manage productos"
on public.productos;

-- Lectura pública: solo productos activos
create policy "Public can read active productos"
on public.productos
for select
to anon, authenticated
using (activo = true);

-- Lectura admin: todos los productos, activos e inactivos
create policy "Admins can read productos"
on public.productos
for select
to authenticated
using (public.is_admin());

-- Insert admin
create policy "Admins can insert productos"
on public.productos
for insert
to authenticated
with check (public.is_admin());

-- Update admin
create policy "Admins can update productos"
on public.productos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Delete admin, aunque por ahora no lo usemos
create policy "Admins can delete productos"
on public.productos
for delete
to authenticated
using (public.is_admin());