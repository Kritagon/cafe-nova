"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyOrdersPoint } from "@/lib/services/dashboard.service";

type DailyOrdersChartProps = {
  data: DailyOrdersPoint[];
};

export function DailyOrdersChart({ data }: DailyOrdersChartProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Tendencia de pedidos diarios
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Pedidos agrupados por dia segun fecha de creacion.
        </p>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="fecha" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="pedidos"
              stroke="#b45309"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
