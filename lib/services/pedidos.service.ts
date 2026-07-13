import { supabase } from "@/lib/supabase/client";
import type {
  CrearPedidoInput,
  CrearPedidoResult,
  PedidoAdmin,
  PedidoDetalleCompleto,
  PedidoFilters,
  PedidoEstado,
} from "@/types/database";

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

export async function getPedidosAdmin(
  filters: PedidoFilters = {},
): Promise<PedidoAdmin[]> {
  let query = supabase
    .from("pedidos")
    .select(
      `
        id,
        codigo_pedido,
        nombre_cliente,
        telefono,
        correo,
        direccion,
        comentarios,
        notas_admin,
        estado,
        total_estimado,
        created_at
      `,
    );

  if (filters.fechaDesde) {
    query = query.gte("created_at", `${filters.fechaDesde}T00:00:00`);
  }

  if (filters.fechaHasta) {
    query = query.lte("created_at", `${filters.fechaHasta}T23:59:59`);
  }

  if (filters.estado && filters.estado !== "todos") {
    query = query.eq("estado", filters.estado);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw new Error(`No se pudieron consultar los pedidos: ${error.message}`);
  }

  const pedidos = (data ?? []) as PedidoAdmin[];
  const busqueda = filters.busqueda?.trim().toLowerCase();

  if (!busqueda) {
    return pedidos;
  }

  return pedidos.filter((pedido) =>
    [
      pedido.codigo_pedido,
      pedido.nombre_cliente,
      pedido.telefono,
      pedido.correo,
    ].some((value) => value?.toLowerCase().includes(busqueda)),
  );
}

export async function actualizarEstadoPedido(
  pedidoId: number,
  estado: PedidoEstado,
) {
  const { error } = await supabase
    .from("pedidos")
    .update({ estado })
    .eq("id", pedidoId);

  if (error) {
    throw new Error(`No se pudo actualizar el pedido: ${error.message}`);
  }
}

export async function getPedidoDetalleAdmin(
  pedidoId: number,
): Promise<PedidoDetalleCompleto> {
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .select(
      `
        id,
        codigo_pedido,
        nombre_cliente,
        telefono,
        correo,
        direccion,
        comentarios,
        notas_admin,
        estado,
        total_estimado,
        created_at,
        updated_at
      `,
    )
    .eq("id", pedidoId)
    .single();

  if (pedidoError || !pedido) {
    throw new Error(
      `No se pudo consultar el pedido: ${
        pedidoError?.message ?? "respuesta vacia de Supabase"
      }`,
    );
  }

  const { data: detalle, error: detalleError } = await supabase
    .from("pedido_detalle")
    .select(
      `
        id,
        producto_id,
        nombre_producto,
        precio_unitario,
        cantidad,
        subtotal
      `,
    )
    .eq("pedido_id", pedidoId)
    .order("created_at", { ascending: true });

  if (detalleError) {
    throw new Error(
      `No se pudo consultar el detalle del pedido: ${detalleError.message}`,
    );
  }

  return {
    ...pedido,
    detalle: detalle ?? [],
  } as PedidoDetalleCompleto;
}

export async function actualizarNotasPedido(
  pedidoId: number,
  notasAdmin: string,
) {
  const { error } = await supabase
    .from("pedidos")
    .update({ notas_admin: notasAdmin.trim() || null })
    .eq("id", pedidoId);

  if (error) {
    throw new Error(`No se pudieron guardar las notas: ${error.message}`);
  }
}
