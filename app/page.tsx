import {
  Coffee,
  HandHeart,
  Leaf,
  PackageCheck,
  Send,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import {
  getProductosActivos,
  getProductosDestacados,
} from "@/lib/services/productos.service";

const valores = [
  "Calidad",
  "Frescura",
  "Cercania",
  "Tradicion",
  "Pasion por el cafe",
  "Compromiso",
];

const proposito = [
  {
    titulo: "Mision",
    icon: HandHeart,
    texto:
      "Ofrecer cafe artesanal de alta calidad, fresco y cuidadosamente seleccionado, brindando una experiencia cercana, confiable y memorable para cada cliente.",
  },
  {
    titulo: "Vision",
    icon: Sparkles,
    texto:
      "Convertirnos en una marca reconocida por su calidad, cercania y compromiso con el buen cafe, llevando el sabor de Cafe Nova a mas hogares, oficinas y amantes del cafe.",
  },
];

const beneficios = [
  {
    titulo: "Cafe fresco",
    texto: "Seleccionado para conservar aroma, cuerpo y sabor en cada taza.",
    icon: Coffee,
  },
  {
    titulo: "Molido o en grano",
    texto: "Presentaciones para distintas formas de preparar cafe.",
    icon: PackageCheck,
  },
  {
    titulo: "Atencion personalizada",
    texto: "Cada pedido se revisa y confirma con cuidado.",
    icon: HandHeart,
  },
  {
    titulo: "Pedidos simples",
    texto: "Elige productos, envia tu solicitud y coordinamos contigo.",
    icon: Send,
  },
  {
    titulo: "Produccion artesanal",
    texto: "Un enfoque cercano, responsable y hecho con pasion.",
    icon: Leaf,
  },
  {
    titulo: "Casa u oficina",
    texto: "Cafe para rutinas, reuniones y pausas con calma.",
    icon: Truck,
  },
];

const pasosPedido = [
  {
    numero: "01",
    titulo: "Elegi tu cafe",
    texto: "Explora el catalogo y agrega tus productos favoritos.",
  },
  {
    numero: "02",
    titulo: "Envia tu solicitud",
    texto: "Completa tus datos y revisa el total estimado.",
  },
  {
    numero: "03",
    titulo: "Te contactamos",
    texto: "Confirmamos disponibilidad, precio final y entrega.",
  },
];

const testimonios = [
  {
    nombre: "Mariana R.",
    texto:
      "El cafe llego fresco y con un aroma increible. Me encanto poder pedir sin complicaciones.",
  },
  {
    nombre: "Luis C.",
    texto:
      "Ideal para la oficina. Nos contactaron rapido para confirmar y coordinar la entrega.",
  },
  {
    nombre: "Sofia M.",
    texto:
      "Se siente artesanal y cercano. La presentacion es muy cuidada y el sabor excelente.",
  },
];

export default async function Home() {
  const [productosDestacados, productosActivos] = await Promise.all([
    getProductosDestacados(),
    getProductosActivos(),
  ]);
  const productos = (
    productosDestacados.length > 0 ? productosDestacados : productosActivos
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f8efe1] text-[#2a170f]">
      <PublicHeader />

      <section className="relative overflow-hidden bg-[#f8efe1] px-6">
        <div className="absolute inset-x-0 top-0 h-40 bg-[#2a170f]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="z-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-700">
              Cafe artesanal | Costa Rica
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-[#2a170f] md:text-7xl">
              Cafe artesanal para disfrutar cada momento.
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-700 md:text-xl">
              Cafe Nova une frescura, tradicion y cercania en presentaciones
              pensadas para tu hogar, oficina o pausa favorita.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="rounded-full bg-amber-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-colors hover:bg-[#2a170f]"
              >
                Ver catalogo
              </Link>
              <Link
                href="/pedido"
                className="rounded-full border border-amber-900/20 bg-white px-6 py-3 text-sm font-bold text-amber-950 transition-colors hover:border-amber-800 hover:bg-amber-50"
              >
                Hacer pedido
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/60 bg-[#fffaf2] p-4 shadow-2xl shadow-amber-950/20">
              <Image
                src="/images/hero/cafe-nova-products-hero.png"
                alt="Productos Cafe Nova"
                width={900}
                height={980}
                priority
                className="aspect-[4/4.2] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="historia" className="px-6 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[1.5rem] bg-[#2a170f] p-8 text-amber-50 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
              Nuestra historia
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Una pausa con raiz artesanal.
            </h2>
          </div>
          <div className="text-xl leading-9 text-stone-700">
            <p>
              Cafe Nova nace como un pequeno emprendimiento inspirado en la
              pasion por el cafe artesanal y el deseo de acercar una experiencia
              autentica a hogares y oficinas.
            </p>
            <p className="mt-5">
              Creemos que una buena taza de cafe no solo despierta el dia,
              tambien crea momentos, conversaciones y recuerdos.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf2] px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
              Proposito
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Mision, vision y valores con sabor cercano.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {proposito.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.titulo}
                  className="rounded-[1.25rem] border border-amber-900/10 bg-white p-7 shadow-sm"
                >
                  <Icon className="h-11 w-11 rounded-full bg-amber-100 p-2.5 text-amber-900" />
                  <h3 className="mt-5 text-2xl font-black">{item.titulo}</h3>
                  <p className="mt-3 leading-7 text-stone-700">{item.texto}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-amber-900/10 bg-[#2a170f] p-7 text-white">
            <h3 className="text-2xl font-black">Valores</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {valores.map((valor) => (
                <span
                  key={valor}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-amber-100 ring-1 ring-white/10"
                >
                  {valor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
                Seleccion especial
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Productos destacados
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="w-fit rounded-full bg-amber-800 px-5 py-3 text-sm font-bold text-white hover:bg-[#2a170f]"
            >
              Ver catalogo completo
            </Link>
          </div>

          {productos.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productos.map((producto) => (
                <article
                  key={producto.id}
                  className="overflow-hidden rounded-[1.25rem] border border-amber-900/10 bg-white shadow-sm"
                >
                  {producto.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-[#2a170f] p-8">
                      <Image
                        src="/images/branding/cafe-nova-logo-stacked.png"
                        alt="Cafe Nova"
                        width={180}
                        height={180}
                        className="h-36 w-36 object-contain"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm font-bold text-amber-800">
                      {producto.categorias?.nombre ?? "Cafe Nova"}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {producto.nombre}
                    </h3>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-stone-600">
                      {producto.descripcion ?? "Producto disponible en Cafe Nova."}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-950">
                        {producto.presentacion ?? "Presentacion por confirmar"}
                      </span>
                      {producto.tipo_cafe ? (
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-700">
                          {producto.tipo_cafe}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-amber-900/10 pt-5">
                      <p className="text-xl font-black">
                        CRC {Number(producto.precio).toLocaleString("es-CR")}
                      </p>
                      <Link
                        href="/catalogo"
                        className="text-sm font-bold text-amber-800 hover:text-amber-950"
                      >
                        Ver catalogo
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[1.25rem] border border-dashed border-amber-900/20 bg-white p-8 text-stone-600">
              Pronto compartiremos productos destacados de Cafe Nova.
            </div>
          )}
        </div>
      </section>

      <section id="beneficios" className="bg-[#fffaf2] px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
              Beneficios
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Por que elegir Cafe Nova
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((beneficio) => {
              const Icon = beneficio.icon;

              return (
                <article
                  key={beneficio.titulo}
                  className="rounded-[1.25rem] border border-amber-900/10 bg-white p-6 shadow-sm"
                >
                  <Icon className="h-10 w-10 rounded-full bg-amber-100 p-2 text-amber-900" />
                  <h3 className="mt-5 text-xl font-black">
                    {beneficio.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {beneficio.texto}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-800">
              Pedido simple
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Como funciona el pedido
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pasosPedido.map((paso) => (
              <article
                key={paso.numero}
                className="rounded-[1.25rem] border border-amber-900/10 bg-white p-7 shadow-sm"
              >
                <span className="text-sm font-black text-amber-800">
                  {paso.numero}
                </span>
                <h3 className="mt-5 text-2xl font-black">{paso.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {paso.texto}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 rounded-[1.25rem] border border-amber-900/10 bg-amber-50 p-5 text-sm leading-6 text-stone-700">
            No realizamos cobros en linea. Cada pedido se confirma manualmente
            para coordinar disponibilidad, precio final y entrega.
          </p>
        </div>
      </section>

      <section className="bg-[#2a170f] px-6 py-20 text-white">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
              Testimonios
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Pausas que se vuelven favoritas
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonios.map((testimonio) => (
              <article
                key={testimonio.nombre}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 p-6"
              >
                <div className="flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-amber-50/80">
                  &quot;{testimonio.texto}&quot;
                </p>
                <p className="mt-5 font-bold text-white">
                  {testimonio.nombre}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="px-6 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-[2rem] bg-amber-900 p-8 text-white shadow-xl shadow-amber-950/20 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
              Contacto
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Hablemos de tu proxima taza.
            </h2>
            <div className="mt-6 grid gap-2 text-sm text-amber-50 md:grid-cols-2">
              <p>Costa Rica</p>
              <p>WhatsApp: 8888-8888</p>
              <p>Correo: contacto@cafenova.com</p>
              <p>Instagram: @cafenova.cr</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-amber-950 hover:bg-amber-50"
            >
              Ver catalogo
            </Link>
            <Link
              href="/pedido"
              className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Hacer pedido
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
