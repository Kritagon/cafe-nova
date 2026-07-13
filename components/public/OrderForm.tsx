"use client";

import { useState } from "react";

import type { PedidoFormData } from "@/types/database";

type OrderFormProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit: (data: PedidoFormData) => Promise<boolean>;
};

type FormErrors = Partial<Record<keyof PedidoFormData, string>>;

const initialFormData: PedidoFormData = {
  nombre_cliente: "",
  telefono: "",
  correo: "",
  direccion: "",
  comentarios: "",
};

const telefonoRegex = /^\d{8}$/;
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OrderForm({
  disabled = false,
  isSubmitting = false,
  onSubmit,
}: OrderFormProps) {
  const [formData, setFormData] = useState<PedidoFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField(field: keyof PedidoFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};
    const nombreCliente = formData.nombre_cliente.trim();
    const telefono = formData.telefono.trim();
    const correo = formData.correo?.trim() ?? "";

    if (!nombreCliente) {
      nextErrors.nombre_cliente = "El nombre es obligatorio.";
    } else if (nombreCliente.length < 2) {
      nextErrors.nombre_cliente = "El nombre debe tener al menos 2 caracteres.";
    }

    if (!telefono) {
      nextErrors.telefono = "El telefono es obligatorio.";
    } else if (!telefonoRegex.test(telefono)) {
      nextErrors.telefono = "El telefono debe tener exactamente 8 digitos.";
    }

    if (correo && !correoRegex.test(correo)) {
      nextErrors.correo = "Ingresa un correo valido o deja el campo vacio.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const wasSubmitted = await onSubmit(formData);

    if (wasSubmitted) {
      setFormData(initialFormData);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Datos del cliente</h2>
        <p className="mt-2 text-sm text-stone-600">
          Usaremos estos datos para confirmar disponibilidad, precio final y
          entrega.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          Nombre completo
          <input
            type="text"
            value={formData.nombre_cliente}
            onChange={(event) =>
              updateField("nombre_cliente", event.target.value)
            }
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
          {errors.nombre_cliente ? (
            <span className="block text-xs text-red-600">
              {errors.nombre_cliente}
            </span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Telefono
          <input
            type="tel"
            inputMode="numeric"
            maxLength={8}
            pattern="[0-9]{8}"
            value={formData.telefono}
            onChange={(event) =>
              updateField("telefono", event.target.value.replace(/\D/g, ""))
            }
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
          {errors.telefono ? (
            <span className="block text-xs text-red-600">
              {errors.telefono}
            </span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Correo
          <input
            type="email"
            value={formData.correo}
            onChange={(event) => updateField("correo", event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
          {errors.correo ? (
            <span className="block text-xs text-red-600">{errors.correo}</span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700">
          Direccion
          <input
            type="text"
            value={formData.direccion}
            onChange={(event) => updateField("direccion", event.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-stone-700 md:col-span-2">
          Comentarios
          <textarea
            value={formData.comentarios}
            onChange={(event) => updateField("comentarios", event.target.value)}
            rows={4}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-normal text-stone-950"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="mt-6 w-full rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {isSubmitting ? "Enviando pedido..." : "Enviar solicitud de pedido"}
      </button>
    </form>
  );
}
