import Image from "next/image";

import type { ProductoConCategoria } from "@/types/database";

type ProductCardProps = {
  producto: ProductoConCategoria;
  cantidadEnPedido?: number;
  onAddToOrder?: (producto: ProductoConCategoria) => void;
  onChangeQuantity?: (productoId: string, cantidad: number) => void;
};

function getFallbackProductImage(producto: ProductoConCategoria) {
  const presentacion = producto.presentacion?.toLowerCase() ?? "";
  const tipoCafe = producto.tipo_cafe?.toLowerCase() ?? "";
  const isGrano = tipoCafe.includes("grano");
  const is500g = presentacion.includes("500");

  if (isGrano && is500g) {
    return "/images/products/cafe-nova-grano-500g.png";
  }

  if (isGrano) {
    return "/images/products/cafe-nova-grano-250g.png";
  }

  if (is500g) {
    return "/images/products/cafe-nova-molido-500g.png";
  }

  return "/images/products/cafe-nova-molido-250g.png";
}

export function ProductCard({
  producto,
  cantidadEnPedido = 0,
  onAddToOrder,
  onChangeQuantity,
}: ProductCardProps) {
  const fallbackImage = getFallbackProductImage(producto);

  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-amber-900/10 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-700/30 hover:shadow-xl hover:shadow-amber-950/10">
      {producto.imagen_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-[radial-gradient(circle_at_center,#fff1d0_0,#d39246_55%,#3b2115_100%)] p-6">
          <Image
            src={fallbackImage}
            alt={producto.nombre}
            width={340}
            height={260}
            className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-stone-950">
              {producto.nombre}
            </h3>
            {producto.categorias?.nombre ? (
              <p className="mt-1 text-sm font-semibold text-amber-800">
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

        <div className="mt-5 flex flex-wrap gap-2 border-t border-amber-900/10 pt-4 text-sm text-stone-600">
          <span className="rounded-full bg-[#fff4df] px-3 py-1 font-medium text-amber-950">
            {producto.presentacion ?? "Presentacion por confirmar"}
          </span>
          {producto.tipo_cafe ? (
            <span className="rounded-full bg-stone-100 px-3 py-1 font-medium">
              {producto.tipo_cafe}
            </span>
          ) : null}
        </div>

        <div className="mt-5 border-t border-amber-900/10 pt-4">
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
                className="h-10 w-20 rounded-md border border-stone-300 bg-[#fffaf2] px-3 text-sm outline-none focus:border-amber-800"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToOrder?.(producto)}
              className="w-full rounded-full bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-900"
            >
              Agregar al pedido
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
