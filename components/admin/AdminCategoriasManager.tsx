"use client";

import { useEffect, useState } from "react";

import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  actualizarCategoria,
  cambiarEstadoCategoria,
  crearCategoria,
  getCategoriasAdmin,
} from "@/lib/services/categorias.service";
import type { Categoria, CategoriaFormData } from "@/types/database";

export function AdminCategoriasManager() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setError(null);

    try {
      const categoriasAdmin = await getCategoriasAdmin();
      setCategorias(categoriasAdmin);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo cargar la administracion de categorias.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const categoriasAdmin = await getCategoriasAdmin();

        if (isMounted) {
          setCategorias(categoriasAdmin);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la administracion de categorias.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(data: CategoriaFormData) {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (selectedCategory) {
        await actualizarCategoria(selectedCategory.id, data);
        setMessage("Categoria actualizada correctamente.");
      } else {
        await crearCategoria(data);
        setMessage("Categoria creada correctamente.");
      }

      setSelectedCategory(null);
      await loadData();
      return true;
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la categoria.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActivo(categoria: Categoria) {
    setUpdatingId(categoria.id);
    setError(null);
    setMessage(null);

    try {
      await cambiarEstadoCategoria(categoria.id, !categoria.activo);
      setCategorias((current) =>
        current.map((item) =>
          item.id === categoria.id
            ? { ...item, activo: !categoria.activo }
            : item,
        ),
      );
      setMessage(
        categoria.activo
          ? "Categoria desactivada correctamente."
          : "Categoria activada correctamente.",
      );
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "No se pudo cambiar el estado de la categoria.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
        Cargando categorias...
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-4">
        {message ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {categorias.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
            No hay categorias registradas todavia.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Descripcion</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Actualizacion</th>
                    <th className="px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id} className="border-t border-stone-100">
                      <td className="px-4 py-3 font-medium text-stone-950">
                        {categoria.nombre}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {categoria.descripcion ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {categoria.activo ? "Activa" : "Inactiva"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {new Date(
                          categoria.updated_at ?? categoria.created_at,
                        ).toLocaleString("es-CR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCategory(categoria)}
                            className="rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === categoria.id}
                            onClick={() => handleToggleActivo(categoria)}
                            className="rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800 disabled:cursor-not-allowed disabled:bg-stone-100"
                          >
                            {categoria.activo ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <aside>
        <CategoryForm
          key={selectedCategory?.id ?? "nueva-categoria"}
          categoria={selectedCategory}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedCategory(null)}
        />
      </aside>
    </div>
  );
}
