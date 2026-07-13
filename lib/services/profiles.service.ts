import { supabase } from "@/lib/supabase/client";

export type AdminProfile = {
  id: string;
  nombre: string | null;
  rol: string | null;
  activo: boolean;
};

export async function getCurrentProfile(): Promise<AdminProfile | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, rol, activo")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo consultar el perfil: ${error.message}`);
  }

  return data as AdminProfile | null;
}
