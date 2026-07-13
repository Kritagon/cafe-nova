import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Historia", href: "/#historia" },
  { label: "Productos", href: "/catalogo" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Pedido", href: "/pedido" },
  { label: "Contacto", href: "/#contacto" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-950/10 bg-[#fffaf2]/90 px-5 py-4 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/branding/cafe-nova-monogram-cn.png"
            alt="Cafe Nova"
            width={42}
            height={42}
            className="h-10 w-10 rounded-full object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-amber-950">
            Cafe Nova
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-semibold text-stone-700 lg:flex"
          aria-label="Navegacion principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-amber-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/pedido"
          className="rounded-full bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-950"
        >
          Solicitar pedido
        </Link>
      </div>
    </header>
  );
}
