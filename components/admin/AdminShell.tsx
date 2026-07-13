"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [isCheckingSession, setIsCheckingSession] = useState(!isLoginPage);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!data.session && !isLoginPage) {
        router.replace("/admin/login");
        return;
      }

      if (data.session && isLoginPage) {
        router.replace("/admin/pedidos");
        return;
      }

      setIsCheckingSession(false);
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session && !isLoginPage) {
          router.replace("/admin/login");
        }
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-stone-700">
        Verificando sesion...
      </main>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link href="/admin/pedidos" className="font-bold">
            Cafe Nova Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pedidos"
              className="text-sm font-medium text-stone-700 hover:text-amber-700"
            >
              Pedidos
            </Link>
            <Link
              href="/admin/productos"
              className="text-sm font-medium text-stone-700 hover:text-amber-700"
            >
              Productos
            </Link>
            <Link
              href="/admin/categorias"
              className="text-sm font-medium text-stone-700 hover:text-amber-700"
            >
              Categorias
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
            >
              Cerrar sesion
            </button>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
