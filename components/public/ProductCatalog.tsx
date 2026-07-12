"use client";

import { useMemo, useState } from "react";

import { CategoryFilter } from "@/components/public/CategoryFilter";
import { ProductCard } from "@/components/public/ProductCard";
import type { Categoria, ProductoConCategoria } from "@/types/database";

type ProductCatalogProps = {
  productos: ProductoConCategoria[];
  categorias: Categoria[];
};

export function ProductCatalog({ productos, categorias }: ProductCatalogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("todos");

  const productosFiltrados = useMemo(() => {
    if (selectedCategoryId === "todos") {
      return productos;
    }

    return productos.filter(
      (producto) => producto.categoria_id === selectedCategoryId,
    );
  }, [productos, selectedCategoryId]);

  return (
    <div className="space-y-8">
      <CategoryFilter
        categorias={categorias}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {productosFiltrados.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
          No hay productos activos en esta categoria por ahora.
        </div>
      )}
    </div>
  );
}
