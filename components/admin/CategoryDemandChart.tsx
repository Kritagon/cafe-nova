"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategoryDemandPoint } from "@/lib/services/dashboard.service";

type CategoryDemandChartProps = {
  data: CategoryDemandPoint[];
};

export function CategoryDemandChart({ data }: CategoryDemandChartProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Categorias mas solicitadas
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Cantidad total pedida agrupada por categoria.
        </p>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="categoria" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#b45309" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
