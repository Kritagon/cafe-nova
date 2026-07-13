"use client";

import { useEffect, useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { getCategoriasActivas } from "@/lib/services/categorias.service";
import {
  actualizarProducto,
  cambiarEstadoProducto,
  crearProducto,
  getProductosAdmin,
} from "@/lib/services/productos.service";
import type {
  Categoria,
  ProductoConCategoria,
  ProductoFormData,
} from "@/types/database";

export function AdminProductosManager() {
  const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoConCategoria | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setError(null);

    try {
      const [productosAdmin, categoriasActivas] = await Promise.all([
        getProductosAdmin(),
        getCategoriasActivas(),
      ]);
      setProductos(productosAdmin);
      setCategorias(categoriasActivas);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo cargar la administracion de productos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [productosAdmin, categoriasActivas] = await Promise.all([
          getProductosAdmin(),
          getCategoriasActivas(),
        ]);

        if (isMounted) {
          setProductos(productosAdmin);
          setCategorias(categoriasActivas);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la administracion de productos.",
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

  async function handleSubmit(data: ProductoFormData) {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (selectedProduct) {
        await actualizarProducto(selectedProduct.id, data);
        setMessage("Producto actualizado correctamente.");
      } else {
        await crearProducto(data);
        setMessage("Producto creado correctamente.");
      }

      setSelectedProduct(null);
      await loadData();
      return true;
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el producto.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActivo(producto: ProductoConCategoria) {
    setUpdatingId(producto.id);
    setError(null);
    setMessage(null);

    try {
      await cambiarEstadoProducto(producto.id, !producto.activo);
      setProductos((current) =>
        current.map((item) =>
          item.id === producto.id ? { ...item, activo: !producto.activo } : item,
        ),
      );
      setMessage(
        producto.activo
          ? "Producto desactivado correctamente."
          : "Producto activado correctamente.",
      );
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "No se pudo cambiar el estado del producto.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
        Cargando productos...
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

        {productos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
            No hay productos registrados todavia.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                    <th className="px-4 py-3 font-semibold">Precio</th>
                    <th className="px-4 py-3 font-semibold">Presentacion</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Activo</th>
                    <th className="px-4 py-3 font-semibold">Destacado</th>
                    <th className="px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id} className="border-t border-stone-100">
                      <td className="px-4 py-3 font-medium text-stone-950">
                        {producto.nombre}
                      </td>
                      <td className="px-4 py-3">
                        {producto.categorias?.nombre ?? "Sin categoria"}
                      </td>
                      <td className="px-4 py-3">
                        CRC {Number(producto.precio).toLocaleString("es-CR")}
                      </td>
                      <td className="px-4 py-3">
                        {producto.presentacion ?? "-"}
                      </td>
                      <td className="px-4 py-3">{producto.tipo_cafe ?? "-"}</td>
                      <td className="px-4 py-3">
                        {producto.activo ? "Activo" : "Inactivo"}
                      </td>
                      <td className="px-4 py-3">
                        {producto.destacado ? "Si" : "No"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(producto)}
                            className="rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === producto.id}
                            onClick={() => handleToggleActivo(producto)}
                            className="rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800 disabled:cursor-not-allowed disabled:bg-stone-100"
                          >
                            {producto.activo ? "Desactivar" : "Activar"}
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
        <ProductForm
          key={selectedProduct?.id ?? "nuevo-producto"}
          categorias={categorias}
          producto={selectedProduct}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedProduct(null)}
        />
      </aside>
    </div>
  );
}
