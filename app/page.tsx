import { supabase } from "@/lib/supabase/client";

export default async function Home() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select(`
      id,
      nombre,
      descripcion,
      precio,
      presentacion,
      tipo_cafe,
      activo,
      categorias (
        nombre
      )
    `)
    .eq("activo", true);

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Café Nova</h1>
        <p className="mt-4 text-red-600">
          Error al consultar productos: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Café Nova</h1>
      <p className="mt-2 text-gray-600">
        Prueba de conexión con Supabase
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {productos?.map((producto) => (
          <article
            key={producto.id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="mt-2 text-gray-600">{producto.descripcion}</p>
            <p className="mt-2 font-medium">₡{producto.precio}</p>
            <p className="text-sm text-gray-500">
              Presentación: {producto.presentacion}
            </p>
            <p className="text-sm text-gray-500">
              Tipo: {producto.tipo_cafe}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}