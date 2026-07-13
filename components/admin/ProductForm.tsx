"use client";

import { useState } from "react";

import type {
  Categoria,
  ProductoConCategoria,
  ProductoFormData,
  TipoCafe,
} from "@/types/database";

type ProductFormProps = {
  categorias: Categoria[];
  producto?: ProductoConCategoria | null;
  isSubmitting?: boolean;
  onSubmit: (data: ProductoFormData) => Promise<boolean>;
  onCancelEdit: () => void;
};

type ProductFormErrors = Partial<Record<keyof ProductoFormData, string>>;

const tiposCafe: TipoCafe[] = ["molido", "grano", "otro"];

const initialFormData: ProductoFormData = {
  categoria_id: "",
  nombre: "",
  descripcion: "",
  precio: "",
  presentacion: "",
  tipo_cafe: "otro",
  imagen_url: "",
  activo: true,
  destacado: false,
};

function getInitialFormData(
  producto?: ProductoConCategoria | null,
): ProductoFormData {
  if (!producto) {
    return initialFormData;
  }

  return {
    categoria_id: producto.categoria_id ?? "",
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? "",
    precio: String(producto.precio),
    presentacion: producto.presentacion ?? "",
    tipo_cafe:
      producto.tipo_cafe === "molido" ||
      producto.tipo_cafe === "grano" ||
      producto.tipo_cafe === "otro"
        ? producto.tipo_cafe
        : "otro",
    imagen_url: producto.imagen_url ?? "",
    activo: producto.activo,
    destacado: producto.destacado,
  };
}

export function ProductForm({
  categorias,
  producto,
  isSubmitting = false,
  onSubmit,
  onCancelEdit,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductoFormData>(() =>
    getInitialFormData(producto),
  );
  const [errors, setErrors] = useState<ProductFormErrors>({});

  function updateField(
    field: keyof ProductoFormData,
    value: string | boolean,
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: ProductFormErrors = {};
    const precio = Number(formData.precio);

    if (!formData.nombre.trim()) {
      nextErrors.nombre = "El nombre es obligatorio.";
    }

    if (!formData.categoria_id) {
      nextErrors.categoria_id = "Selecciona una categoria.";
    }

    if (!formData.precio.trim() || Number.isNaN(precio) || precio < 0) {
      nextErrors.precio = "El precio debe ser numerico y mayor o igual a 0.";
    }

    if (!formData.presentacion.trim()) {
      nextErrors.presentacion = "La presentacion es obligatoria.";
    }

    if (!tiposCafe.includes(formData.tipo_cafe)) {
      nextErrors.tipo_cafe = "Selecciona un tipo de cafe valido.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const wasSaved = await onSubmit(formData);

    if (wasSaved && !producto) {
      setFormData(initialFormData);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div className="border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-950">
            {producto ? "Editar producto" : "Crear producto"}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Completa la informacion que se mostrara en el catalogo publico.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Nombre
          <input
            type="text"
            value={formData.nombre}
            onChange={(event) => updateField("nombre", event.target.value)}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          />
          {errors.nombre ? (
            <span className="block text-xs text-red-600">{errors.nombre}</span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Categoria
          <select
            value={formData.categoria_id}
            onChange={(event) => updateField("categoria_id", event.target.value)}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          >
            <option value="">Selecciona una categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id ? (
            <span className="block text-xs text-red-600">
              {errors.categoria_id}
            </span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Precio
          <input
            type="number"
            min={0}
            step="0.01"
            value={formData.precio}
            onChange={(event) => updateField("precio", event.target.value)}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          />
          {errors.precio ? (
            <span className="block text-xs text-red-600">{errors.precio}</span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Presentacion
          <input
            type="text"
            value={formData.presentacion}
            onChange={(event) =>
              updateField("presentacion", event.target.value)
            }
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          />
          {errors.presentacion ? (
            <span className="block text-xs text-red-600">
              {errors.presentacion}
            </span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Tipo de cafe
          <select
            value={formData.tipo_cafe}
            onChange={(event) =>
              updateField("tipo_cafe", event.target.value as TipoCafe)
            }
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          >
            {tiposCafe.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipo_cafe ? (
            <span className="block text-xs text-red-600">
              {errors.tipo_cafe}
            </span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Imagen URL
          <input
            type="url"
            value={formData.imagen_url}
            onChange={(event) => updateField("imagen_url", event.target.value)}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700 md:col-span-2">
          Descripcion
          <textarea
            value={formData.descripcion}
            onChange={(event) => updateField("descripcion", event.target.value)}
            rows={4}
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm font-normal text-stone-950 outline-none transition-colors focus:border-amber-700 focus:bg-white"
          />
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            checked={formData.activo}
            onChange={(event) => updateField("activo", event.target.checked)}
            className="h-4 w-4"
          />
          Activo
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            checked={formData.destacado}
            onChange={(event) => updateField("destacado", event.target.checked)}
            className="h-4 w-4"
          />
          Destacado
        </label>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
        {producto ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSubmitting
            ? "Guardando..."
            : producto
              ? "Guardar cambios"
              : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
