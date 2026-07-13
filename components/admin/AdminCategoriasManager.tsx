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
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      setIsFormOpen(false);
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

  function handleNewCategory() {
    setSelectedCategory(null);
    setIsFormOpen(true);
  }

  function handleEditCategory(categoria: Categoria) {
    setSelectedCategory(categoria);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setSelectedCategory(null);
    setIsFormOpen(false);
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">
        Cargando categorias...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Catalogo
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
              Categorias
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Organiza el catalogo publico y controla que categorias aparecen
              como filtros visibles para los clientes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewCategory}
            className="inline-flex w-fit rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-800"
          >
            Nueva categoria
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {message ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {categorias.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">
              No hay categorias registradas todavia
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Crea categorias para organizar el catalogo publico.
            </p>
            <button
              type="button"
              onClick={handleNewCategory}
              className="mt-5 rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Nueva categoria
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="flex flex-col gap-1 border-b border-stone-200 bg-stone-50 px-5 py-4">
              <h2 className="font-semibold text-stone-950">
                Listado de categorias
              </h2>
              <p className="text-sm text-stone-600">
                {categorias.length} categorias registradas
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-600">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Nombre</th>
                    <th className="px-5 py-3 font-semibold">Descripcion</th>
                    <th className="px-5 py-3 font-semibold">Estado</th>
                    <th className="px-5 py-3 font-semibold">Actualizacion</th>
                    <th className="px-5 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categorias.map((categoria) => (
                    <tr
                      key={categoria.id}
                      className="transition-colors hover:bg-amber-50/40"
                    >
                      <td className="px-5 py-4 font-semibold text-stone-950">
                        {categoria.nombre}
                      </td>
                      <td className="px-5 py-4 text-stone-600">
                        {categoria.descripcion ?? "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            categoria.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {categoria.activo ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-600">
                        {new Date(
                          categoria.updated_at ?? categoria.created_at,
                        ).toLocaleString("es-CR")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(categoria)}
                            className="rounded-full border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:border-amber-700 hover:bg-amber-50"
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

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4 py-8">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-lg bg-stone-50 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {selectedCategory ? "Edicion" : "Nueva categoria"}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {selectedCategory
                    ? selectedCategory.nombre
                    : "Crear categoria"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
              >
                Cerrar
              </button>
            </div>
            <div className="p-6">
              <CategoryForm
                key={selectedCategory?.id ?? "nueva-categoria"}
                categoria={selectedCategory}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onCancelEdit={handleCloseForm}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
