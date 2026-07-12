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
    "rounded-full border px-4 py-2 text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
      <button
        type="button"
        onClick={() => onSelectCategory("todos")}
        className={`${buttonBase} ${
          selectedCategoryId === "todos"
            ? "border-amber-700 bg-amber-700 text-white"
            : "border-stone-200 bg-white text-stone-700 hover:border-amber-700"
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
              ? "border-amber-700 bg-amber-700 text-white"
              : "border-stone-200 bg-white text-stone-700 hover:border-amber-700"
          }`}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
