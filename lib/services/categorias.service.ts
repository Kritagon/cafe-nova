import { supabase } from "@/lib/supabase/client";
import type { Categoria } from "@/types/database";

export async function getCategoriasActivas(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select(
      `
        id,
        nombre,
        descripcion,
        activo,
        created_at,
        updated_at
      `,
    )
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar categorias activas: ${error.message}`);
  }

  return (data ?? []) as Categoria[];
}
