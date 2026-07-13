import type { PedidoItem } from "@/types/database";

type OrderSummaryProps = {
  items: PedidoItem[];
  onChangeQuantity: (productoId: string, cantidad: number) => void;
  onRemoveItem: (productoId: string) => void;
};

export function OrderSummary({
  items,
  onChangeQuantity,
  onRemoveItem,
}: OrderSummaryProps) {
  const totalEstimado = items.reduce(
    (total, item) => total + item.precio_unitario * item.cantidad,
    0,
  );

  return (
    <section className="rounded-[1.25rem] border border-amber-900/10 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-2xl font-black tracking-tight">
          Resumen del pedido
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Revisa cantidades y total estimado antes de enviar tu solicitud.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-amber-900/20 bg-[#fff8ec] p-6 text-center text-sm text-stone-600">
          Aun no has agregado productos al pedido.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const subtotal = item.precio_unitario * item.cantidad;

            return (
              <div
                key={item.producto_id}
                className="grid gap-3 border-b border-stone-100 pb-4 last:border-b-0 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <h3 className="font-semibold text-stone-950">
                    {item.nombre_producto}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    CRC {item.precio_unitario.toLocaleString("es-CR")} unidad
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-800">
                    Subtotal: CRC {subtotal.toLocaleString("es-CR")}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <label className="sr-only" htmlFor={`cantidad-${item.producto_id}`}>
                    Cantidad de {item.nombre_producto}
                  </label>
                  <input
                    id={`cantidad-${item.producto_id}`}
                    type="number"
                    min={1}
                    value={item.cantidad}
                    onChange={(event) =>
                      onChangeQuantity(
                        item.producto_id,
                        Number(event.target.value),
                      )
                    }
                    className="h-10 w-20 rounded-md border border-stone-300 bg-[#fffaf2] px-3 text-sm outline-none focus:border-amber-800"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.producto_id)}
                    className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 hover:border-red-300 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between rounded-[1rem] bg-[#fff4df] p-4">
            <span className="font-semibold text-stone-700">
              Total estimado
            </span>
            <span className="text-xl font-bold text-stone-950">
              CRC {totalEstimado.toLocaleString("es-CR")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
