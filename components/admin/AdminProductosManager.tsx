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
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      setIsFormOpen(false);
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

  function handleNewProduct() {
    setSelectedProduct(null);
    setIsFormOpen(true);
  }

  function handleEditProduct(producto: ProductoConCategoria) {
    setSelectedProduct(producto);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setSelectedProduct(null);
    setIsFormOpen(false);
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">
        Cargando productos...
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
              Productos
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Administra los productos visibles en el catalogo publico, sus
              categorias, precios y estado de publicacion.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewProduct}
            className="inline-flex w-fit rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-800"
          >
            Nuevo producto
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

        {productos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">
              No hay productos registrados todavia
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Crea el primer producto para mostrarlo en el catalogo publico.
            </p>
            <button
              type="button"
              onClick={handleNewProduct}
              className="mt-5 rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Nuevo producto
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-stone-200 bg-stone-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-stone-950">
                  Inventario de productos
                </h3>
                <p className="text-sm text-stone-600">
                  {productos.length} productos registrados
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
                <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-600">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Nombre</th>
                    <th className="px-5 py-3 font-semibold">Categoria</th>
                    <th className="px-5 py-3 font-semibold">Precio</th>
                    <th className="px-5 py-3 font-semibold">Presentacion</th>
                    <th className="px-5 py-3 font-semibold">Tipo de cafe</th>
                    <th className="px-5 py-3 font-semibold">Estado</th>
                    <th className="px-5 py-3 font-semibold">Destacado</th>
                    <th className="px-5 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {productos.map((producto) => (
                    <tr
                      key={producto.id}
                      className="transition-colors hover:bg-amber-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-950">
                          {producto.nombre}
                        </div>
                        <div className="mt-1 max-w-xs truncate text-xs text-stone-500">
                          {producto.descripcion ?? "Sin descripcion"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-700">
                        {producto.categorias?.nombre ?? "Sin categoria"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-stone-950">
                        CRC {Number(producto.precio).toLocaleString("es-CR")}
                      </td>
                      <td className="px-5 py-4 text-stone-700">
                        {producto.presentacion ?? "-"}
                      </td>
                      <td className="px-5 py-4 text-stone-700">
                        {producto.tipo_cafe ?? "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            producto.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {producto.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            producto.destacado
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {producto.destacado ? "Destacado" : "Normal"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(producto)}
                            className="rounded-full border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:border-amber-700 hover:bg-amber-50"
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

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4 py-8">
          <div className="max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-stone-50 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {selectedProduct ? "Edicion" : "Nuevo producto"}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {selectedProduct
                    ? selectedProduct.nombre
                    : "Crear producto"}
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
              <ProductForm
                key={selectedProduct?.id ?? "nuevo-producto"}
                categorias={categorias}
                producto={selectedProduct}
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
