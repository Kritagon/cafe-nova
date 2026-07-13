"use client";

import { useMemo, useState } from "react";

import { CategoryFilter } from "@/components/public/CategoryFilter";
import { OrderForm } from "@/components/public/OrderForm";
import { OrderSummary } from "@/components/public/OrderSummary";
import { ProductCard } from "@/components/public/ProductCard";
import { crearPedido } from "@/lib/services/pedidos.service";
import type {
  Categoria,
  PedidoFormData,
  PedidoItem,
  ProductoConCategoria,
} from "@/types/database";

type ProductCatalogProps = {
  productos: ProductoConCategoria[];
  categorias: Categoria[];
  showOrderSection?: boolean;
};

export function ProductCatalog({
  productos,
  categorias,
  showOrderSection = true,
}: ProductCatalogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("todos");
  const [pedidoItems, setPedidoItems] = useState<PedidoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const productosFiltrados = useMemo(() => {
    if (selectedCategoryId === "todos") {
      return productos;
    }

    return productos.filter(
      (producto) => producto.categoria_id === selectedCategoryId,
    );
  }, [productos, selectedCategoryId]);

  function agregarAlPedido(producto: ProductoConCategoria) {
    setConfirmation(null);
    setSubmitError(null);
    setPedidoItems((current) => {
      const existingItem = current.find(
        (item) => item.producto_id === producto.id,
      );

      if (existingItem) {
        return current.map((item) =>
          item.producto_id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          producto_id: producto.id,
          nombre_producto: producto.nombre,
          precio_unitario: Number(producto.precio),
          cantidad: 1,
        },
      ];
    });
  }

  function cambiarCantidad(productoId: string, cantidad: number) {
    const nextCantidad = Math.max(1, Number.isFinite(cantidad) ? cantidad : 1);

    setPedidoItems((current) =>
      current.map((item) =>
        item.producto_id === productoId
          ? { ...item, cantidad: nextCantidad }
          : item,
      ),
    );
  }

  function eliminarProducto(productoId: string) {
    setPedidoItems((current) =>
      current.filter((item) => item.producto_id !== productoId),
    );
  }

  async function enviarPedido(cliente: PedidoFormData) {
    setSubmitError(null);
    setConfirmation(null);
    setIsSubmitting(true);

    try {
      const pedido = await crearPedido({ cliente, items: pedidoItems });
      setPedidoItems([]);
      setConfirmation(
        `Gracias por tu solicitud. Hemos recibido tu pedido y pronto te contactaremos para confirmar disponibilidad, precio final y entrega. Codigo: ${pedido.codigo_pedido}`,
      );
      return true;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el pedido. Intentalo nuevamente.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <CategoryFilter
        categorias={categorias}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-800">
            Productos disponibles
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Cafe para cada momento
          </h2>
        </div>
        <p className="text-sm font-medium text-stone-600">
          {productosFiltrados.length} productos encontrados
        </p>
      </div>

      {productosFiltrados.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              cantidadEnPedido={
                pedidoItems.find((item) => item.producto_id === producto.id)
                  ?.cantidad ?? 0
              }
              onAddToOrder={showOrderSection ? agregarAlPedido : undefined}
              onChangeQuantity={showOrderSection ? cambiarCantidad : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-amber-900/20 bg-white p-8 text-center text-stone-600 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">
            No hay productos en esta categoria
          </h3>
          <p className="mt-2 text-sm">
            Prueba con otro filtro o vuelve a revisar el catalogo completo.
          </p>
        </div>
      )}

      {showOrderSection ? (
        <section
          id="pedido"
          className="grid gap-6 rounded-[1.75rem] border border-amber-900/10 bg-white/80 p-4 shadow-xl shadow-amber-950/5 lg:grid-cols-2 lg:p-6"
        >
          <OrderSummary
            items={pedidoItems}
            onChangeQuantity={cambiarCantidad}
            onRemoveItem={eliminarProducto}
          />

          <div className="space-y-4">
            {confirmation ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-800">
                {confirmation}
              </div>
            ) : null}

            {submitError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700">
                {submitError}
              </div>
            ) : null}

            <OrderForm
              disabled={pedidoItems.length === 0}
              isSubmitting={isSubmitting}
              onSubmit={enviarPedido}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
