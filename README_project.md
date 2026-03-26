# PlootTest

Repositorio monorepo de una aplicacion web construida con `Next.js`, `React`, `Supabase`, `Zod`, `React Query`, `Playwright`, `pnpm` y `Turborepo`.

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
pnpm install
```

## Ejecucion

Desarrollo:

```bash
pnpm dev
```

Build de produccion:

```bash
pnpm build
```

Arranque en modo produccion:

```bash
pnpm start
```

## Scripts

```bash
pnpm dev
```

Levanta la aplicacion en desarrollo.

```bash
pnpm build
```

Genera el build de produccion.

```bash
pnpm start
```

Ejecuta la aplicacion con el build generado.

```bash
pnpm lint
```

Ejecuta `eslint`.

```bash
pnpm typecheck
```

Ejecuta validacion de tipos con `tsc --noEmit`.

```bash
pnpm test
```

Ejecuta la suite de tests unitarios con `Vitest`.

```bash
pnpm test:watch
```

Ejecuta `Vitest` en modo watch.

```bash
pnpm test:e2e
```

Genera build y ejecuta tests E2E con `Playwright`.

```bash
pnpm test:ui
```

Genera build y actualiza snapshots visuales del test E2E base.

```bash
pnpm seed:products
```

Carga el catalogo inicial desde el seed JSON.

## Base de datos y seed

- Esquema SQL: [schema.sql](/Users/cruiiz/Git/plootTest/apps/web/supabase/schema.sql)
- Seed de productos: [products.seed.json](/Users/cruiiz/Git/plootTest/apps/web/src/lib/data/products.seed.json)
- Script de carga: [seed-products.ts](/Users/cruiiz/Git/plootTest/apps/web/scripts/seed-products.ts)

## Estructura del proyecto

```text
apps/
  web/
    src/        # app Next.js
    tests/      # pruebas unitarias, E2E y setup
    scripts/    # scripts auxiliares
    supabase/   # esquema y recursos de base de datos

packages/
  config-eslint/
  config-typescript/

docs/           # documentacion formal del proyecto
```

## Documentacion

La documentacion del proyecto esta en:

- arquitectura: [arquitectura-del-sistema.md](/Users/cruiiz/Git/plootTest/docs/arquitectura-del-sistema.md)
- roadmap: [roadmap.md](/Users/cruiiz/Git/plootTest/docs/roadmap/roadmap.md)
- ADRs: [docs/ADR](/Users/cruiiz/Git/plootTest/docs/ADR)
- requisitos: [docs/requisitos](/Users/cruiiz/Git/plootTest/docs/requisitos)
