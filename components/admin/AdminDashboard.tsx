"use client";

import { useEffect, useState } from "react";

import { CategoryDemandChart } from "@/components/admin/CategoryDemandChart";
import { DashboardFilters } from "@/components/admin/DashboardFilters";
import { DailyOrdersChart } from "@/components/admin/DailyOrdersChart";
import {
  getDashboardStats,
  type DashboardStats,
} from "@/lib/services/dashboard.service";
import type { DashboardFilters as DashboardFiltersType } from "@/types/database";

const currencyFormatter = new Intl.NumberFormat("es-CR");

function formatCurrency(value: number) {
  return `CRC ${currencyFormatter.format(value)}`;
}

type KpiCardProps = {
  label: string;
  value: string | number;
};

function KpiCard({ label, value }: KpiCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
        {value}
      </p>
    </article>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [filters, setFilters] = useState<DashboardFiltersType>({
    estado: "todos",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const dashboardStats = await getDashboardStats(filters);

        if (isMounted) {
          setStats(dashboardStats);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  function handleFilter(nextFilters: DashboardFiltersType) {
    setIsLoading(true);
    setError(null);
    setFilters(nextFilters);
  }

  function handleClear() {
    setIsLoading(true);
    setError(null);
    setFilters({ estado: "todos" });
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
        Cargando dashboard...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error ?? "No se pudo cargar el dashboard."}
      </div>
    );
  }

  const { kpis } = stats;

  return (
    <div className="space-y-8">
      <DashboardFilters
        filters={filters}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total de pedidos" value={kpis.totalPedidos} />
        <KpiCard label="Pendientes" value={kpis.pedidosPendientes} />
        <KpiCard label="Confirmados" value={kpis.pedidosConfirmados} />
        <KpiCard
          label="En preparacion"
          value={kpis.pedidosEnPreparacion}
        />
        <KpiCard label="Entregados" value={kpis.pedidosEntregados} />
        <KpiCard label="Cancelados" value={kpis.pedidosCancelados} />
        <KpiCard label="Productos activos" value={kpis.productosActivos} />
        <KpiCard label="Categorias activas" value={kpis.categoriasActivas} />
        <KpiCard
          label="Total estimado"
          value={formatCurrency(kpis.totalEstimadoPedidos)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DailyOrdersChart data={stats.pedidosDiarios} />
        <CategoryDemandChart data={stats.demandaCategorias} />
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-bold tracking-tight">Ultimos pedidos</h2>
          <p className="mt-1 text-sm text-stone-600">
            Solicitudes mas recientes registradas en Cafe Nova.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-stone-100 text-stone-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Codigo</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Total estimado</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {stats.ultimosPedidos.map((pedido) => (
                <tr key={pedido.id} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-medium text-stone-950">
                    {pedido.codigo_pedido ?? `Pedido #${pedido.id}`}
                  </td>
                  <td className="px-4 py-3">{pedido.nombre_cliente}</td>
                  <td className="px-4 py-3">{pedido.estado}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(Number(pedido.total_estimado))}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(pedido.created_at).toLocaleString("es-CR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
