import { AdminPedidosList } from "@/components/admin/AdminPedidosList";

export default function AdminPedidosPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Operacion
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Pedidos recibidos
          </h1>
          <p className="mt-3 text-stone-600">
            Consulta solicitudes de pedido y actualiza su estado operativo.
          </p>
        </div>

        <AdminPedidosList />
      </div>
    </main>
  );
}
