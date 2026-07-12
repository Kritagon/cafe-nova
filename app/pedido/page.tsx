import Link from "next/link";

import { ProductCatalog } from "@/components/public/ProductCatalog";
import { getCategoriasActivas } from "@/lib/services/categorias.service";
import { getProductosActivos } from "@/lib/services/productos.service";

export default async function PedidoPage() {
  const [productos, categorias] = await Promise.all([
    getProductosActivos(),
    getCategoriasActivas(),
  ]);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <section className="border-b border-stone-200 bg-white px-6 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <Link
            href="/catalogo"
            className="w-fit text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Volver al catalogo
          </Link>

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Solicitud de pedido
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
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
        <div className="mx-auto w-full max-w-6xl">
          <ProductCatalog productos={productos} categorias={categorias} />
        </div>
      </section>
    </main>
  );
}
