import { supabase } from "@/lib/supabase/client";
import type { Categoria, ProductoConCategoria } from "@/types/database";

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
