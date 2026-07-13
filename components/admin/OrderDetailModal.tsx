"use client";

import { useEffect, useState } from "react";

import {
  actualizarEstadoPedido,
  actualizarNotasPedido,
  getPedidoDetalleAdmin,
} from "@/lib/services/pedidos.service";
import type { PedidoDetalleCompleto, PedidoEstado } from "@/types/database";

type OrderDetailModalProps = {
  pedidoId: number;
  onUpdated?: () => void | Promise<void>;
  onClose: () => void;
};

const estadosPedido: PedidoEstado[] = [
  "pendiente",
  "confirmado",
  "en_preparacion",
  "entregado",
  "cancelado",
];

const estadoStyles: Record<PedidoEstado, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmado: "bg-blue-100 text-blue-800",
  en_preparacion: "bg-orange-100 text-orange-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

const currencyFormatter = new Intl.NumberFormat("es-CR");

function formatCurrency(value: number) {
  return `CRC ${currencyFormatter.format(value)}`;
}

export function OrderDetailModal({
  pedidoId,
  onUpdated,
  onClose,
}: OrderDetailModalProps) {
  const [pedido, setPedido] = useState<PedidoDetalleCompleto | null>(null);
  const [notas, setNotas] = useState("");
  const [estado, setEstado] = useState<PedidoEstado>("pendiente");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPedido() {
      try {
        const pedidoDetalle = await getPedidoDetalleAdmin(pedidoId);

        if (isMounted) {
          setPedido(pedidoDetalle);
          setNotas(pedidoDetalle.notas_admin ?? "");
          setEstado(pedidoDetalle.estado);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el detalle del pedido.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPedido();

    return () => {
      isMounted = false;
    };
  }, [pedidoId]);

  async function handleSavePedido() {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await Promise.all([
        actualizarEstadoPedido(pedidoId, estado),
        actualizarNotasPedido(pedidoId, notas),
      ]);
      setPedido((current) =>
        current
          ? { ...current, estado, notas_admin: notas.trim() || null }
          : current,
      );
      await onUpdated?.();
      setMessage("Pedido actualizado correctamente.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo actualizar el pedido.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4 py-8">
      <div className="max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-stone-50 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Detalle de pedido
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              {pedido?.codigo_pedido ?? `Pedido #${pedidoId}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
          >
            Cerrar
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
              Cargando detalle...
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {message}
            </div>
          ) : null}

          {pedido ? (
            <div className="space-y-6">
              <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Cliente
                  </p>
                  <p className="mt-1 font-semibold text-stone-950">
                    {pedido.nombre_cliente}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {pedido.telefono}
                  </p>
                  <p className="text-sm text-stone-600">
                    {pedido.correo ?? "Sin correo"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Pedido
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Estado:{" "}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[pedido.estado]}`}
                    >
                      {pedido.estado}
                    </span>
                  </p>
                  <p className="text-sm text-stone-600">
                    Total:{" "}
                    <span className="font-semibold">
                      {formatCurrency(Number(pedido.total_estimado))}
                    </span>
                  </p>
                  <p className="text-sm text-stone-600">
                    Fecha: {new Date(pedido.created_at).toLocaleString("es-CR")}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Direccion y comentarios
                  </p>
                  <p className="mt-1 text-sm text-stone-700">
                    {pedido.direccion ?? "Sin direccion"}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {pedido.comentarios ?? "Sin comentarios del cliente"}
                  </p>
                </div>
              </section>

              <section className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
                  <h4 className="font-semibold text-stone-950">Productos</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-600">
                      <tr>
                        <th className="px-5 py-3">Producto</th>
                        <th className="px-5 py-3">Cantidad</th>
                        <th className="px-5 py-3">Precio</th>
                        <th className="px-5 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {pedido.detalle.map((item) => (
                        <tr key={item.id}>
                          <td className="px-5 py-4 font-medium text-stone-950">
                            {item.nombre_producto}
                          </td>
                          <td className="px-5 py-4">{item.cantidad}</td>
                          <td className="px-5 py-4">
                            {formatCurrency(Number(item.precio_unitario))}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            {formatCurrency(Number(item.subtotal))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-lg border border-stone-200 bg-white p-5">
                <label className="space-y-2 text-sm font-medium text-stone-700">
                  Estado del pedido
                  <select
                    value={estado}
                    onChange={(event) =>
                      setEstado(event.target.value as PedidoEstado)
                    }
                    className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
                  >
                    {estadosPedido.map((estadoPedido) => (
                      <option key={estadoPedido} value={estadoPedido}>
                        {estadoPedido}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-stone-700">
                  Notas internas
                  <textarea
                    value={notas}
                    onChange={(event) => setNotas(event.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
                    placeholder="Notas visibles solo para administracion"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSavePedido}
                  disabled={isSaving}
                  className="mt-4 rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
