import Link from "next/link";

import { ProductCatalog } from "@/components/public/ProductCatalog";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { getCategoriasActivas } from "@/lib/services/categorias.service";
import { getProductosActivos } from "@/lib/services/productos.service";

export default async function PedidoPage() {
  const [productos, categorias] = await Promise.all([
    getProductosActivos(),
    getCategoriasActivas(),
  ]);

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-stone-950">
      <PublicHeader />

      <section className="border-b border-amber-950/10 bg-[linear-gradient(135deg,#fffaf2_0%,#f7d8a8_55%,#e5a85e_100%)] px-6 py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <Link
            href="/catalogo"
            className="w-fit text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Volver al catalogo
          </Link>

          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
              Solicitud de pedido
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              Arma tu pedido
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone-700">
              Selecciona productos, revisa el total estimado y envia tus datos
              para que Cafe Nova confirme disponibilidad, precio final y
              entrega.
            </p>
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
