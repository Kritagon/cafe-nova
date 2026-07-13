import Link from "next/link";

import { ProductCatalog } from "@/components/public/ProductCatalog";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { getCategoriasActivas } from "@/lib/services/categorias.service";
import { getProductosActivos } from "@/lib/services/productos.service";

export default async function CatalogoPage() {
  const [productos, categorias] = await Promise.all([
    getProductosActivos(),
    getCategoriasActivas(),
  ]);

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-stone-950">
      <PublicHeader />

      <section className="border-b border-amber-950/10 bg-[linear-gradient(135deg,#2a170f_0%,#6d3b1d_44%,#f3d7a8_100%)] px-6 py-12 text-white md:py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <Link
            href="/"
            className="w-fit text-sm font-semibold text-amber-100 hover:text-white"
          >
            Volver al inicio
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
                Catalogo Cafe Nova
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
                Elegi el cafe para tu proxima pausa
              </h1>
              <p className="mt-5 text-lg leading-8 text-amber-50/85">
                Explora productos activos de Cafe Nova, filtra por categoria y
                arma una solicitud sencilla. Cada pedido se confirma
                manualmente para cuidar disponibilidad y entrega.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#pedido"
                  className="rounded-full bg-white px-5 py-3 text-sm font-bold text-amber-950 shadow-sm transition-colors hover:bg-amber-50"
                >
                  Ir al resumen de pedido
                </Link>
                <Link
                  href="/pedido"
                  className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Abrir solicitud de pedido
                </Link>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/20 bg-white/10 p-6 shadow-sm backdrop-blur">
              <p className="text-sm font-bold text-amber-100">
                Cafe artesanal
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-50/80">
                Disponible molido o en grano, ideal para casa, oficina y
                momentos que merecen una taza con calma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto w-full max-w-7xl">
          <ProductCatalog productos={productos} categorias={categorias} />
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
