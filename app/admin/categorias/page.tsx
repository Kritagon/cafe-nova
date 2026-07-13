import { AdminCategoriasManager } from "@/components/admin/AdminCategoriasManager";

export default function AdminCategoriasPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Administracion
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Categorias
          </h1>
          <p className="mt-3 text-stone-600">
            Crea, edita y activa categorias usadas por el catalogo publico.
          </p>
        </div>

        <AdminCategoriasManager />
      </div>
    </main>
  );
}
