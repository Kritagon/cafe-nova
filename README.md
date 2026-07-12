# Cafe Nova

Aplicacion web moderna para una cafeteria, construida con Next.js, TypeScript, Tailwind CSS y Supabase.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- GitHub

## Estado actual

- Proyecto Next.js creado y ejecutandose localmente.
- Supabase configurado mediante variables de entorno.
- La conexion con Supabase ya fue probada.
- La pagina inicial carga productos activos desde la tabla `productos`.
- Row Level Security esta activado en Supabase.
- La lectura publica de productos activos funciona con las politicas actuales.
- El proyecto esta en la fase de estructura base y documentacion inicial antes de construir el catalogo publico completo.

## Estructura base

- `app/`: rutas y paginas de Next.js.
- `components/public/`: componentes del sitio publico.
- `components/admin/`: componentes del futuro portal administrativo.
- `components/shared/`: componentes reutilizables.
- `lib/supabase/`: cliente y utilidades de Supabase.
- `lib/services/`: funciones de acceso a datos.
- `lib/utils/`: utilidades generales.
- `types/`: tipos TypeScript compartidos.
- `docs/sql/`: scripts y referencias SQL del proyecto.

## Configuracion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env.local` con las variables necesarias de Supabase.

No subas `.env.local` al repositorio. Usa `.env.local.example` como referencia.

3. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir:

```text
http://localhost:3000
```

## Documentacion SQL

Los scripts documentales viven en `docs/sql/`.

- `01-schema.sql`: esquema de base de datos.
- `02-seed-data.sql`: datos iniciales.
- `03-rls-policies.sql`: politicas RLS.

Por ahora pueden contener encabezados hasta consolidar los scripts definitivos usados en Supabase.
