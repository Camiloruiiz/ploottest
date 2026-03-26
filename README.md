# PlootTest

Repositorio de una aplicacion web construida con `Next.js`, `React`, `Supabase`, `Zod`, `React Query` y `Playwright`.

## Requisitos previos

- `Node.js >= 20`
- proyecto de `Supabase`
- variables de entorno configuradas

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Instalacion

```bash
npm install
```

## Ejecucion

Desarrollo:

```bash
npm run dev
```

Build de produccion:

```bash
npm run build
```

Arranque en modo produccion:

```bash
npm run start
```

## Scripts

```bash
npm run dev
```

Levanta la aplicacion en desarrollo.

```bash
npm run build
```

Genera el build de produccion.

```bash
npm run start
```

Ejecuta la aplicacion con el build generado.

```bash
npm run lint
```

Ejecuta `eslint`.

```bash
npm run typecheck
```

Ejecuta validacion de tipos con `tsc --noEmit`.

```bash
npm test
```

Ejecuta la suite de tests unitarios con `Vitest`.

```bash
npm run test:watch
```

Ejecuta `Vitest` en modo watch.

```bash
npm run test:e2e
```

Genera build y ejecuta tests E2E con `Playwright`.

```bash
npm run test:ui
```

Genera build y actualiza snapshots visuales del test E2E base.

```bash
npm run seed:products
```

Carga el catalogo inicial desde el seed JSON.

## Base de datos y seed

- Esquema SQL: [schema.sql](/Users/cruiiz/Git/plootTest/supabase/schema.sql)
- Seed de productos: [products.seed.json](/Users/cruiiz/Git/plootTest/src/lib/data/products.seed.json)
- Script de carga: [seed-products.ts](/Users/cruiiz/Git/plootTest/scripts/seed-products.ts)

## Estructura del proyecto

```text
src/
  app/          # rutas y entrypoints de Next.js
  components/   # componentes de UI y sistema
  hooks/        # hooks reutilizables
  lib/          # configuracion, db, validacion y utilidades
  modules/      # organizacion por dominios

scripts/        # scripts auxiliares
supabase/       # esquema y recursos de base de datos
tests/          # pruebas unitarias, E2E y setup
docs/           # documentacion formal del proyecto
```

## Documentacion

La documentacion del proyecto esta en [docs](/Users/cruiiz/Git/plootTest/docs/).
