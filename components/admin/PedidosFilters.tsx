"use client";

import { useState } from "react";

import type { PedidoFilters as PedidoFiltersType } from "@/types/database";

type PedidosFiltersProps = {
  filters: PedidoFiltersType;
  onFilter: (filters: PedidoFiltersType) => void;
  onClear: () => void;
};

const estados = [
  "todos",
  "pendiente",
  "confirmado",
  "en_preparacion",
  "entregado",
  "cancelado",
] as const;

export function PedidosFilters({
  filters,
  onFilter,
  onClear,
}: PedidosFiltersProps) {
  const [draftFilters, setDraftFilters] = useState<PedidoFiltersType>(filters);

  function updateField(field: keyof PedidoFiltersType, value: string) {
    setDraftFilters((current) => ({ ...current, [field]: value }));
  }

  function handleClear() {
    setDraftFilters({ estado: "todos" });
    onClear();
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight">Filtros</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Fecha desde
          <input
            type="date"
            value={draftFilters.fechaDesde ?? ""}
            onChange={(event) => updateField("fechaDesde", event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Fecha hasta
          <input
            type="date"
            value={draftFilters.fechaHasta ?? ""}
            onChange={(event) => updateField("fechaHasta", event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Estado
          <select
            value={draftFilters.estado ?? "todos"}
            onChange={(event) => updateField("estado", event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          >
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado === "todos" ? "Todos" : estado}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Busqueda
          <input
            type="search"
            value={draftFilters.busqueda ?? ""}
            onChange={(event) => updateField("busqueda", event.target.value)}
            placeholder="Codigo, cliente, telefono o correo"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => onFilter(draftFilters)}
            className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}
