import { supabase } from "@/lib/supabase/client";
import type { CrearPedidoInput, CrearPedidoResult } from "@/types/database";

type CrearPedidoPublicoResponse = {
  pedido_id: number;
  codigo_pedido: string;
  total_estimado: number;
};

export async function crearPedido({
  cliente,
  items,
}: CrearPedidoInput): Promise<CrearPedidoResult> {
  if (items.length === 0) {
    throw new Error("Debes agregar al menos un producto al pedido.");
  }

  const rpcItems = items.map((item) => ({
    producto_id: Number(item.producto_id),
    cantidad: Math.max(1, item.cantidad),
  }));

  if (rpcItems.some((item) => Number.isNaN(item.producto_id))) {
    throw new Error("Hay productos con identificador invalido en el pedido.");
  }

  const { data, error } = await supabase.rpc("crear_pedido_publico", {
    p_nombre_cliente: cliente.nombre_cliente.trim(),
    p_telefono: cliente.telefono.trim(),
    p_correo: cliente.correo?.trim() || null,
    p_direccion: cliente.direccion?.trim() || null,
    p_comentarios: cliente.comentarios?.trim() || null,
    p_items: rpcItems,
  });

  if (error) {
    throw new Error(`No se pudo registrar el pedido: ${error.message}`);
  }

  const pedido = Array.isArray(data)
    ? (data[0] as CrearPedidoPublicoResponse | undefined)
    : (data as CrearPedidoPublicoResponse | null);

  if (!pedido) {
    throw new Error("No se pudo registrar el pedido: respuesta vacia de Supabase.");
  }

  return {
    id: pedido.pedido_id,
    codigo_pedido: pedido.codigo_pedido,
    total_estimado: Number(pedido.total_estimado),
  };
}
