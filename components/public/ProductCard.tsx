import type { ProductoConCategoria } from "@/types/database";

type ProductCardProps = {
  producto: ProductoConCategoria;
  cantidadEnPedido?: number;
  onAddToOrder?: (producto: ProductoConCategoria) => void;
  onChangeQuantity?: (productoId: string, cantidad: number) => void;
};

export function ProductCard({
  producto,
  cantidadEnPedido = 0,
  onAddToOrder,
  onChangeQuantity,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      {producto.imagen_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-stone-100 text-sm font-medium uppercase tracking-[0.18em] text-stone-400">
          Cafe Nova
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-stone-950">
              {producto.nombre}
            </h3>
            {producto.categorias?.nombre ? (
              <p className="mt-1 text-sm font-medium text-amber-700">
                {producto.categorias.nombre}
              </p>
            ) : null}
          </div>

          <p className="text-lg font-bold text-stone-950">
            CRC {Number(producto.precio).toLocaleString("es-CR")}
          </p>
        </div>

        <p className="mt-4 min-h-16 text-sm leading-6 text-stone-600">
          {producto.descripcion ?? "Producto disponible en Cafe Nova."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-4 text-sm text-stone-600">
          <span className="rounded-full bg-stone-100 px-3 py-1">
            {producto.presentacion ?? "Presentacion por confirmar"}
          </span>
          {producto.tipo_cafe ? (
            <span className="rounded-full bg-stone-100 px-3 py-1">
              {producto.tipo_cafe}
            </span>
          ) : null}
        </div>

        <div className="mt-5 border-t border-stone-100 pt-4">
          {cantidadEnPedido > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <label
                className="text-sm font-medium text-stone-700"
                htmlFor={`producto-cantidad-${producto.id}`}
              >
                Cantidad
              </label>
              <input
                id={`producto-cantidad-${producto.id}`}
                type="number"
                min={1}
                value={cantidadEnPedido}
                onChange={(event) =>
                  onChangeQuantity?.(producto.id, Number(event.target.value))
                }
                className="h-10 w-20 rounded-md border border-stone-300 px-3 text-sm"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToOrder?.(producto)}
              className="w-full rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
            >
              Agregar al pedido
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
