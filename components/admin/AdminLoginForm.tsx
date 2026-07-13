"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!correo.trim() || !password) {
      setError("Ingresa correo y contrasena para continuar.");
      return;
    }

    setIsSubmitting(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password,
    });

    setIsSubmitting(false);

    if (loginError) {
      setError("No se pudo iniciar sesion. Revisa tus credenciales.");
      return;
    }

    router.replace("/admin/pedidos");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Administracion
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Iniciar sesion
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Accede para consultar pedidos recibidos y actualizar su estado.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Correo
          <input
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {isSubmitting ? "Ingresando..." : "Iniciar sesion"}
      </button>
    </form>
  );
}
