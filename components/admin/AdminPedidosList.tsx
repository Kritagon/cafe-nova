"use client";

import { useEffect, useState } from "react";

import { PedidosFilters } from "@/components/admin/PedidosFilters";
import {
  actualizarEstadoPedido,
  getPedidosAdmin,
} from "@/lib/services/pedidos.service";
import type { PedidoAdmin, PedidoEstado, PedidoFilters } from "@/types/database";

const estadosPedido: PedidoEstado[] = [
  "pendiente",
  "confirmado",
  "en_preparacion",
  "entregado",
  "cancelado",
];

export function AdminPedidosList() {
  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
  const [filters, setFilters] = useState<PedidoFilters>({ estado: "todos" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPedidos() {
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

    loadPedidos();

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

  async function handleEstadoChange(pedidoId: number, estado: PedidoEstado) {
    setUpdatingId(pedidoId);
    setError(null);

    try {
      await actualizarEstadoPedido(pedidoId, estado);
      setPedidos((current) =>
        current.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado } : pedido,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "No se pudo actualizar el estado.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {pedidos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
          No hay pedidos registrados todavia.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Codigo</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Telefono</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium text-stone-950">
                      {pedido.codigo_pedido ?? `Pedido #${pedido.id}`}
                    </td>
                    <td className="px-4 py-3">{pedido.nombre_cliente}</td>
                    <td className="px-4 py-3">{pedido.telefono}</td>
                    <td className="px-4 py-3">
                      <select
                        value={pedido.estado}
                        disabled={updatingId === pedido.id}
                        onChange={(event) =>
                          handleEstadoChange(
                            pedido.id,
                            event.target.value as PedidoEstado,
                          )
                        }
                        className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                      >
                        {estadosPedido.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      CRC {Number(pedido.total_estimado).toLocaleString("es-CR")}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {new Date(pedido.created_at).toLocaleString("es-CR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
