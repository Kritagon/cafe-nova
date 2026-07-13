import { supabase } from "@/lib/supabase/client";
import type { Categoria, CategoriaFormData } from "@/types/database";

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

export async function getCategoriasAdmin(): Promise<Categoria[]> {
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
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error al consultar categorias: ${error.message}`);
  }

  return (data ?? []) as Categoria[];
}

function buildCategoriaPayload(categoria: CategoriaFormData) {
  return {
    nombre: categoria.nombre.trim(),
    descripcion: categoria.descripcion.trim() || null,
    activo: categoria.activo,
  };
}

export async function crearCategoria(categoria: CategoriaFormData) {
  const { error } = await supabase
    .from("categorias")
    .insert(buildCategoriaPayload(categoria));

  if (error) {
    throw new Error(`Error al crear categoria: ${error.message}`);
  }
}

export async function actualizarCategoria(
  categoriaId: string,
  categoria: CategoriaFormData,
) {
  const { error } = await supabase
    .from("categorias")
    .update(buildCategoriaPayload(categoria))
    .eq("id", categoriaId);

  if (error) {
    throw new Error(`Error al actualizar categoria: ${error.message}`);
  }
}

export async function cambiarEstadoCategoria(
  categoriaId: string,
  activo: boolean,
) {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    throw new Error("Debes iniciar sesion para cambiar el estado de la categoria.");
  }

  const { error } = await supabase
    .from("categorias")
    .update({ activo })
    .eq("id", categoriaId);

  if (error) {
    throw new Error(`Error al cambiar estado de la categoria: ${error.message}`);
  }
}
