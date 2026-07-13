"use client";

import { useState } from "react";

import type { Categoria, CategoriaFormData } from "@/types/database";

type CategoryFormProps = {
  categoria?: Categoria | null;
  isSubmitting?: boolean;
  onSubmit: (data: CategoriaFormData) => Promise<boolean>;
  onCancelEdit: () => void;
};

type CategoryFormErrors = Partial<Record<keyof CategoriaFormData, string>>;

const initialFormData: CategoriaFormData = {
  nombre: "",
  descripcion: "",
  activo: true,
};

function getInitialFormData(categoria?: Categoria | null): CategoriaFormData {
  if (!categoria) {
    return initialFormData;
  }

  return {
    nombre: categoria.nombre,
    descripcion: categoria.descripcion ?? "",
    activo: categoria.activo,
  };
}

export function CategoryForm({
  categoria,
  isSubmitting = false,
  onSubmit,
  onCancelEdit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoriaFormData>(() =>
    getInitialFormData(categoria),
  );
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  function updateField(
    field: keyof CategoriaFormData,
    value: string | boolean,
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: CategoryFormErrors = {};
    const nombre = formData.nombre.trim();

    if (!nombre) {
      nextErrors.nombre = "El nombre es obligatorio.";
    } else if (nombre.length < 2) {
      nextErrors.nombre = "El nombre debe tener al menos 2 caracteres.";
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

    if (wasSaved && !categoria) {
      setFormData(initialFormData);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {categoria ? "Editar categoria" : "Crear categoria"}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Las categorias activas aparecen en el filtro del catalogo publico.
          </p>
        </div>
        {categoria ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-amber-700 hover:text-amber-800"
          >
            Nueva
          </button>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Nombre
          <input
            type="text"
            value={formData.nombre}
            onChange={(event) => updateField("nombre", event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
          {errors.nombre ? (
            <span className="block text-xs text-red-600">{errors.nombre}</span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Descripcion
          <textarea
            value={formData.descripcion}
            onChange={(event) => updateField("descripcion", event.target.value)}
            rows={4}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            checked={formData.activo}
            onChange={(event) => updateField("activo", event.target.checked)}
            className="h-4 w-4"
          />
          Activa
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {isSubmitting
          ? "Guardando..."
          : categoria
            ? "Guardar cambios"
            : "Crear categoria"}
      </button>
    </form>
  );
}
