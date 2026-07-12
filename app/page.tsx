import { getProductosActivos } from "@/lib/services/productos.service";

export default async function Home() {
  const productos = await getProductosActivos();

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Cafe de especialidad
        </p>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Cafe Nova
          </h1>
          <p className="mt-6 text-2xl font-medium text-stone-800 md:text-3xl">
            Una pausa moderna para disfrutar cafe con caracter.
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            Cafe Nova es una cafeteria pensada para combinar buen cafe,
            productos seleccionados y una experiencia digital sencilla para
            explorar el catalogo antes de hacer un pedido.
          </p>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white px-6 py-14">
        <div className="mx-auto w-full max-w-6xl">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Productos destacados
            </h2>
            <p className="mt-2 text-stone-600">
              Primer vistazo al catalogo activo de Cafe Nova.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="rounded-lg border border-stone-200 bg-stone-50 p-5 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{producto.nombre}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-stone-600">
                  {producto.descripcion ?? "Producto disponible en Cafe Nova."}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-stone-200 pt-4">
                  <p className="text-lg font-bold">
                    CRC {Number(producto.precio).toLocaleString("es-CR")}
                  </p>
                  <p className="text-sm text-stone-500">
                    {producto.presentacion ?? "Presentacion por confirmar"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
