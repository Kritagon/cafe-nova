"use client";

import { useCallback, useEffect, useState } from "react";

import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { PedidosFilters } from "@/components/admin/PedidosFilters";
import { getPedidosAdmin } from "@/lib/services/pedidos.service";
import type { PedidoAdmin, PedidoEstado, PedidoFilters } from "@/types/database";

const estadoStyles: Record<PedidoEstado, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmado: "bg-blue-100 text-blue-800",
  en_preparacion: "bg-orange-100 text-orange-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export function AdminPedidosList() {
  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
  const [filters, setFilters] = useState<PedidoFilters>({ estado: "todos" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);

  const loadPedidos = useCallback(async () => {
    try {
      const pedidosAdmin = await getPedidosAdmin(filters);
      setPedidos(pedidosAdmin);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los pedidos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    async function loadMountedPedidos() {
      try {
        const pedidosAdmin = await getPedidosAdmin(filters);

        if (isMounted) {
          setPedidos(pedidosAdmin);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los pedidos.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMountedPedidos();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  function handleFilter(nextFilters: PedidoFilters) {
    setIsLoading(true);
    setError(null);
    setFilters(nextFilters);
  }

  function handleClear() {
    setIsLoading(true);
    setError(null);
    setFilters({ estado: "todos" });
  }

  async function handlePedidoUpdated() {
    setIsLoading(true);
    setError(null);
    await loadPedidos();
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PedidosFilters
        filters={filters}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {pedidos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">
            No hay pedidos registrados todavia
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            Cuando un cliente envie una solicitud, aparecera en esta lista.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-stone-200 bg-stone-50 px-5 py-4">
            <h2 className="font-semibold text-stone-950">Listado de pedidos</h2>
            <p className="text-sm text-stone-600">
              {pedidos.length} pedidos encontrados
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Codigo</th>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Telefono</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="transition-colors hover:bg-amber-50/40"
                  >
                    <td className="px-5 py-4 font-medium text-stone-950">
                      {pedido.codigo_pedido ?? `Pedido #${pedido.id}`}
                    </td>
                    <td className="px-5 py-4">{pedido.nombre_cliente}</td>
                    <td className="px-5 py-4">{pedido.telefono}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${estadoStyles[pedido.estado]}`}
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-950">
                      CRC {Number(pedido.total_estimado).toLocaleString("es-CR")}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {new Date(pedido.created_at).toLocaleString("es-CR")}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPedidoId(pedido.id)}
                        className="rounded-full border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:border-amber-700 hover:bg-amber-50"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPedidoId ? (
        <OrderDetailModal
          pedidoId={selectedPedidoId}
          onUpdated={handlePedidoUpdated}
          onClose={() => setSelectedPedidoId(null)}
        />
      ) : null}
    </div>
  );
}
