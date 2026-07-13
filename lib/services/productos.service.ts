import { supabase } from "@/lib/supabase/client";
import type {
  Categoria,
  ProductoConCategoria,
  ProductoFormData,
} from "@/types/database";

type ProductoSupabase = Omit<ProductoConCategoria, "categorias"> & {
  categorias?: Pick<Categoria, "id" | "nombre"> | Pick<Categoria, "id" | "nombre">[] | null;
};

export async function getProductosActivos(): Promise<ProductoConCategoria[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      `
        id,
        categoria_id,
        nombre,
        descripcion,
        precio,
        presentacion,
        tipo_cafe,
        imagen_url,
        activo,
        destacado,
        created_at,
        updated_at,
        categorias (
          id,
          nombre
        )
      `,
    )
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar productos activos: ${error.message}`);
  }

  const productos = (data ?? []) as unknown as ProductoSupabase[];

  return productos.map((producto) => ({
    ...producto,
    categorias: Array.isArray(producto.categorias)
      ? (producto.categorias[0] ?? null)
      : (producto.categorias ?? null),
  }));
}

export async function getProductosAdmin(): Promise<ProductoConCategoria[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      `
        id,
        categoria_id,
        nombre,
        descripcion,
        precio,
        presentacion,
        tipo_cafe,
        imagen_url,
        activo,
        destacado,
        created_at,
        updated_at,
        categorias (
          id,
          nombre
        )
      `,
    )
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar productos: ${error.message}`);
  }

  const productos = (data ?? []) as unknown as ProductoSupabase[];

  return productos.map((producto) => ({
    ...producto,
    categorias: Array.isArray(producto.categorias)
      ? (producto.categorias[0] ?? null)
      : (producto.categorias ?? null),
  }));
}

function buildProductoPayload(producto: ProductoFormData) {
  return {
    categoria_id: producto.categoria_id,
    nombre: producto.nombre.trim(),
    descripcion: producto.descripcion.trim() || null,
    precio: Number(producto.precio),
    presentacion: producto.presentacion.trim(),
    tipo_cafe: producto.tipo_cafe,
    imagen_url: producto.imagen_url.trim() || null,
    activo: producto.activo,
    destacado: producto.destacado,
  };
}

export async function crearProducto(producto: ProductoFormData) {
  const { error } = await supabase
    .from("productos")
    .insert(buildProductoPayload(producto));

  if (error) {
    throw new Error(`Error al crear producto: ${error.message}`);
  }
}

export async function actualizarProducto(
  productoId: string,
  producto: ProductoFormData,
) {
  const { error } = await supabase
    .from("productos")
    .update(buildProductoPayload(producto))
    .eq("id", productoId);

  if (error) {
    throw new Error(`Error al actualizar producto: ${error.message}`);
  }
}

export async function cambiarEstadoProducto(productoId: string, activo: boolean) {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    throw new Error("Debes iniciar sesion para cambiar el estado del producto.");
  }

  const { error } = await supabase
    .from("productos")
    .update({ activo })
    .eq("id", productoId);

  if (error) {
    throw new Error(`Error al cambiar estado del producto: ${error.message}`);
  }
}
