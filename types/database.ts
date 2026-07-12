export type PedidoEstado =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "entregado"
  | "cancelado";

export type TipoCafe =
  | "grano"
  | "molido"
  | "bebida"
  | "postre"
  | "otro";

export type Categoria = {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type Producto = {
  id: string;
  categoria_id: string | null;
  nombre: string;
  descripcion: string | null;
  precio: number;
  presentacion: string | null;
  tipo_cafe: TipoCafe | string | null;
  imagen_url: string | null;
  activo: boolean;
  destacado: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductoConCategoria = Producto & {
  categorias?: Pick<Categoria, "id" | "nombre"> | null;
};

export type Pedido = {
  id: string;
  codigo_pedido: string | null;
  nombre_cliente: string;
  telefono: string;
  correo: string | null;
  direccion: string | null;
  comentarios: string | null;
  estado: PedidoEstado;
  total_estimado: number;
  created_at: string;
  updated_at: string;
};

export type PedidoDetalle = {
  id: string;
  pedido_id: string;
  producto_id: string | null;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  created_at: string;
};

export type PedidoItem = {
  producto_id: string;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
};

export type PedidoFormData = {
  nombre_cliente: string;
  telefono: string;
  correo?: string;
  direccion?: string;
  comentarios?: string;
};

export type CrearPedidoInput = {
  cliente: PedidoFormData;
  items: PedidoItem[];
};

export type CrearPedidoResult = {
  id: number;
  codigo_pedido: string;
  total_estimado: number;
};
