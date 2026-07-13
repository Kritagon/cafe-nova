import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Reportes
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-3 text-stone-600">
            Vista ejecutiva de pedidos, productos y categorias para tomar
            decisiones rapidas.
          </p>
        </div>

        <AdminDashboard />
      </div>
    </main>
  );
}
