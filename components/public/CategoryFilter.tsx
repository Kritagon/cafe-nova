"use client";

import type { Categoria } from "@/types/database";

type CategoryFilterProps = {
  categorias: Categoria[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

export function CategoryFilter({
  categorias,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  const buttonBase =
    "rounded-full border px-4 py-2 text-sm font-semibold transition-colors";

  return (
    <section className="rounded-[1.25rem] border border-amber-900/10 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-800">
          Filtros
        </p>
        <h2 className="text-2xl font-black tracking-tight">
          Explora por categoria
        </h2>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
        <button
          type="button"
          onClick={() => onSelectCategory("todos")}
          className={`${buttonBase} ${
            selectedCategoryId === "todos"
              ? "border-amber-800 bg-amber-800 text-white shadow-sm"
              : "border-amber-900/10 bg-[#fff8ec] text-stone-700 hover:border-amber-800 hover:bg-amber-50"
          }`}
        >
          Todos
        </button>

        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            onClick={() => onSelectCategory(categoria.id)}
            className={`${buttonBase} ${
              selectedCategoryId === categoria.id
                ? "border-amber-800 bg-amber-800 text-white shadow-sm"
                : "border-amber-900/10 bg-[#fff8ec] text-stone-700 hover:border-amber-800 hover:bg-amber-50"
            }`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
    </section>
  );
}
