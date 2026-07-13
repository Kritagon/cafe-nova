import Image from "next/image";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-[#24140d] px-6 py-12 text-amber-50">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Image
            src="/images/branding/cafe-nova-logo-horizontal-light.png"
            alt="Cafe Nova"
            width={180}
            height={64}
            className="h-auto w-44 object-contain"
          />
          <p className="mt-5 max-w-sm text-sm leading-6 text-amber-100/80">
            Cafe artesanal costarricense para hogares, oficinas y pausas que
            merecen sabor, calma y cercania.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Ver catalogo
            </Link>
            <Link
              href="/pedido"
              className="rounded-full border border-amber-100/30 px-4 py-2.5 text-sm font-semibold text-amber-50 hover:bg-white/10"
            >
              Hacer pedido
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Enlaces
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-amber-100/80">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            <Link href="/catalogo" className="hover:text-white">
              Catalogo
            </Link>
            <Link href="/pedido" className="hover:text-white">
              Pedido
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Contacto
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-amber-100/80">
            <p>Costa Rica</p>
            <p>WhatsApp: 8888-8888</p>
            <p>contacto@cafenova.com</p>
            <p>@cafenova.cr</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Horario
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-amber-100/80">
            <p>Lunes a viernes</p>
            <p>8:00 a.m. - 5:00 p.m.</p>
            <p>Pedidos sujetos a confirmacion manual.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
