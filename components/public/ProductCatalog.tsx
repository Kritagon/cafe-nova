"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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

type OrderConfirmation = {
  codigoPedido: string | null;
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
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(
    null,
  );
  const confirmationRef = useRef<HTMLDivElement | null>(null);
  const submitLockRef = useRef(false);

  const productosFiltrados = useMemo(() => {
    if (selectedCategoryId === "todos") {
      return productos;
    }

    return productos.filter(
      (producto) => producto.categoria_id === selectedCategoryId,
    );
  }, [productos, selectedCategoryId]);

  useEffect(() => {
    if (!confirmation) {
      return;
    }

    confirmationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [confirmation]);

  function agregarAlPedido(producto: ProductoConCategoria) {
    if (confirmation) {
      submitLockRef.current = false;
    }

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
    if (submitLockRef.current || confirmation) {
      return false;
    }

    submitLockRef.current = true;
    setSubmitError(null);
    setConfirmation(null);
    setIsSubmitting(true);

    try {
      const pedido = await crearPedido({ cliente, items: pedidoItems });
      setPedidoItems([]);
      setConfirmation({ codigoPedido: pedido.codigo_pedido ?? null });
      return true;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el pedido. Intentalo nuevamente.",
      );
      submitLockRef.current = false;
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  function iniciarOtroPedido() {
    submitLockRef.current = false;
    setConfirmation(null);
    setSubmitError(null);
    setPedidoItems([]);
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
              <div
                ref={confirmationRef}
                className="rounded-[1.25rem] border border-emerald-200 bg-[#f3f8ec] p-6 shadow-sm"
                role="status"
                tabIndex={-1}
              >
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-800">
                  Pedido recibido
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-stone-950">
                  Gracias por tu solicitud
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-700">
                  Gracias por tu solicitud. Hemos recibido tu pedido y pronto te
                  contactaremos para confirmar disponibilidad, precio final y
                  entrega.
                </p>

                {confirmation.codigoPedido ? (
                  <div className="mt-5 rounded-lg border border-emerald-200 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-stone-600">
                      Código de pedido:
                    </p>
                    <p className="mt-1 text-xl font-black tracking-tight text-emerald-900">
                      {confirmation.codigoPedido}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/catalogo"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-800 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-900"
                  >
                    Volver al catálogo
                  </Link>
                  <button
                    type="button"
                    onClick={iniciarOtroPedido}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-800 bg-white px-5 py-3 text-sm font-semibold text-amber-900 transition-colors hover:bg-[#fff4df]"
                  >
                    Hacer otro pedido
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
