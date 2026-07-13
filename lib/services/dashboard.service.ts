import { supabase } from "@/lib/supabase/client";
import type { DashboardFilters, PedidoEstado } from "@/types/database";

export type DashboardKpis = {
  totalPedidos: number;
  pedidosPendientes: number;
  pedidosConfirmados: number;
  pedidosEnPreparacion: number;
  pedidosEntregados: number;
  pedidosCancelados: number;
  productosActivos: number;
  categoriasActivas: number;
  totalEstimadoPedidos: number;
};

export type DailyOrdersPoint = {
  fecha: string;
  pedidos: number;
};

export type CategoryDemandPoint = {
  categoria: string;
  cantidad: number;
};

export type DashboardPedido = {
  id: number;
  codigo_pedido: string | null;
  nombre_cliente: string;
  estado: PedidoEstado;
  total_estimado: number;
  created_at: string;
};

export type DashboardStats = {
  kpis: DashboardKpis;
  pedidosDiarios: DailyOrdersPoint[];
  demandaCategorias: CategoryDemandPoint[];
  ultimosPedidos: DashboardPedido[];
};

type PedidoDetalleDashboard = {
  pedido_id: number;
  producto_id: string | number | null;
  cantidad: number;
};

type ProductoDashboard = {
  id: string | number;
  categoria_id: string | number | null;
};

type CategoriaDashboard = {
  id: string | number;
  nombre: string;
};

const emptyKpis: DashboardKpis = {
  totalPedidos: 0,
  pedidosPendientes: 0,
  pedidosConfirmados: 0,
  pedidosEnPreparacion: 0,
  pedidosEntregados: 0,
  pedidosCancelados: 0,
  productosActivos: 0,
  categoriasActivas: 0,
  totalEstimadoPedidos: 0,
};

function formatDateKey(value: string) {
  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function buildPedidosDiarios(pedidos: DashboardPedido[]) {
  const grouped = new Map<string, number>();

  pedidos.forEach((pedido) => {
    const key = formatDateKey(pedido.created_at);
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });

  return Array.from(grouped.entries())
    .map(([fecha, cantidad]) => ({ fecha, pedidos: cantidad }))
    .slice(-14);
}

function buildDemandaCategorias(
  detalles: PedidoDetalleDashboard[],
  productos: ProductoDashboard[],
  categorias: CategoriaDashboard[],
) {
  const categoriaPorId = new Map(
    categorias.map((categoria) => [String(categoria.id), categoria.nombre]),
  );
  const categoriaIdPorProductoId = new Map(
    productos.map((producto) => [
      String(producto.id),
      producto.categoria_id ? String(producto.categoria_id) : null,
    ]),
  );
  const demanda = new Map<string, number>();

  detalles.forEach((detalle) => {
    if (!detalle.producto_id) {
      return;
    }

    const categoriaId = categoriaIdPorProductoId.get(String(detalle.producto_id));
    const categoriaNombre = categoriaId
      ? (categoriaPorId.get(categoriaId) ?? "Sin categoria")
      : "Sin categoria";

    demanda.set(
      categoriaNombre,
      (demanda.get(categoriaNombre) ?? 0) + Number(detalle.cantidad),
    );
  });

  return Array.from(demanda.entries())
    .map(([categoria, cantidad]) => ({ categoria, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 8);
}

function filterPedidos(
  pedidos: DashboardPedido[],
  filters: DashboardFilters = {},
) {
  return pedidos.filter((pedido) => {
    const createdAt = new Date(pedido.created_at).getTime();
    const fechaDesde = filters.fechaDesde
      ? new Date(`${filters.fechaDesde}T00:00:00`).getTime()
      : null;
    const fechaHasta = filters.fechaHasta
      ? new Date(`${filters.fechaHasta}T23:59:59`).getTime()
      : null;

    if (fechaDesde && createdAt < fechaDesde) {
      return false;
    }

    if (fechaHasta && createdAt > fechaHasta) {
      return false;
    }

    if (filters.estado && filters.estado !== "todos") {
      return pedido.estado === filters.estado;
    }

    return true;
  });
}

export async function getDashboardStats(
  filters: DashboardFilters = {},
): Promise<DashboardStats> {
  const [
    pedidosResponse,
    detallesResponse,
    productosResponse,
    categoriasResponse,
  ] = await Promise.all([
    supabase
      .from("pedidos")
      .select("id, codigo_pedido, nombre_cliente, estado, total_estimado, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("pedido_detalle").select("pedido_id, producto_id, cantidad"),
    supabase.from("productos").select("id, categoria_id, activo"),
    supabase.from("categorias").select("id, nombre, activo"),
  ]);

  if (pedidosResponse.error) {
    throw new Error(
      `No se pudieron consultar pedidos: ${pedidosResponse.error.message}`,
    );
  }

  if (detallesResponse.error) {
    throw new Error(
      `No se pudo consultar el detalle de pedidos: ${detallesResponse.error.message}`,
    );
  }

  if (productosResponse.error) {
    throw new Error(
      `No se pudieron consultar productos: ${productosResponse.error.message}`,
    );
  }

  if (categoriasResponse.error) {
    throw new Error(
      `No se pudieron consultar categorias: ${categoriasResponse.error.message}`,
    );
  }

  const pedidos = (pedidosResponse.data ?? []) as DashboardPedido[];
  const pedidosFiltrados = filterPedidos(pedidos, filters);
  const pedidoIdsFiltrados = new Set(
    pedidosFiltrados.map((pedido) => pedido.id),
  );
  const detalles = (detallesResponse.data ?? []) as PedidoDetalleDashboard[];
  const detallesFiltrados = detalles.filter((detalle) =>
    pedidoIdsFiltrados.has(Number(detalle.pedido_id)),
  );
  const productos = (productosResponse.data ?? []) as (ProductoDashboard & {
    activo: boolean;
  })[];
  const categorias = (categoriasResponse.data ?? []) as (CategoriaDashboard & {
    activo: boolean;
  })[];

  const kpis = pedidosFiltrados.reduce<DashboardKpis>(
    (totals, pedido) => {
      totals.totalPedidos += 1;
      totals.totalEstimadoPedidos += Number(pedido.total_estimado);

      if (pedido.estado === "pendiente") totals.pedidosPendientes += 1;
      if (pedido.estado === "confirmado") totals.pedidosConfirmados += 1;
      if (pedido.estado === "en_preparacion") totals.pedidosEnPreparacion += 1;
      if (pedido.estado === "entregado") totals.pedidosEntregados += 1;
      if (pedido.estado === "cancelado") totals.pedidosCancelados += 1;

      return totals;
    },
    {
      ...emptyKpis,
      productosActivos: productos.filter((producto) => producto.activo).length,
      categoriasActivas: categorias.filter((categoria) => categoria.activo)
        .length,
    },
  );

  return {
    kpis,
    pedidosDiarios: buildPedidosDiarios([...pedidosFiltrados].reverse()),
    demandaCategorias: buildDemandaCategorias(
      detallesFiltrados,
      productos,
      categorias,
    ),
    ultimosPedidos: pedidosFiltrados.slice(0, 8),
  };
}
