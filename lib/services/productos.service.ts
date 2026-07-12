import { supabase } from "@/lib/supabase/client";
import type { Producto } from "@/types/database";

export async function getProductosActivos(): Promise<Producto[]> {
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
        updated_at
      `,
    )
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar productos activos: ${error.message}`);
  }

  return (data ?? []) as Producto[];
}
