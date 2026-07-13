"use client";

import {
  ClipboardList,
  Coffee,
  LayoutDashboard,
  LogOut,
  Tags,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import {
  getCurrentProfile,
  type AdminProfile,
} from "@/lib/services/profiles.service";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [isCheckingSession, setIsCheckingSession] = useState(!isLoginPage);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

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
        router.replace("/admin/dashboard");
        return;
      }

      if (data.session && !isLoginPage) {
        try {
          const currentProfile = await getCurrentProfile();
          setProfile(currentProfile);
        } catch {
          setProfile(null);
        }
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

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/pedidos",
      label: "Pedidos",
      icon: ClipboardList,
    },
    {
      href: "/admin/productos",
      label: "Productos",
      icon: Coffee,
    },
    {
      href: "/admin/categorias",
      label: "Categorias",
      icon: Tags,
    },
  ];

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
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-700 text-sm font-bold text-white shadow-sm">
              CN
            </span>
            <span>
              <span className="block text-sm font-bold leading-4">
                Cafe Nova
              </span>
              <span className="text-xs font-medium text-stone-500">
                Portal administrativo
              </span>
            </span>
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between xl:flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-amber-700 text-white shadow-sm"
                        : "text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
                <User size={16} className="text-amber-700" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-stone-900">
                    {profile?.nombre ?? "Admin"}
                  </p>
                  <p className="text-xs text-stone-500">
                    {profile?.rol ?? "Administrador"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
              >
                <LogOut size={16} />
                Cerrar sesion
              </button>
            </div>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
