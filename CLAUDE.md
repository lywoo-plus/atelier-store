# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is pnpm (pinned via `packageManager`; ignore the npm/yarn/bun variants in README.md).

```bash
pnpm dev            # next dev (Turbopack)
pnpm build          # production build
pnpm lint           # eslint (flat config, eslint-config-next core-web-vitals + typescript)
pnpm typecheck      # tsc --noEmit

pnpm db:generate    # drizzle-kit generate — write SQL migrations to ./drizzle from src/db/schema.ts
pnpm db:migrate     # apply migrations
pnpm db:push        # push schema straight to the DB without a migration file
pnpm db:seed        # replace the catalogue tables with the sample data in src/db/seed.ts
pnpm db:studio      # Drizzle Studio
```

There is no test runner configured yet.

## Environment

Copy `.env.example` to `.env.local`. Required: `DATABASE_URL` (Neon Postgres), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Optional: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` turn on Google sign-in (redirect URI `<BETTER_AUTH_URL>/api/auth/callback/google`). `drizzle.config.ts` loads `.env.local` then `.env` through dotenv (and `db:seed` passes both to tsx), so the `db:*` scripts read the same files as Next. A fresh database needs `pnpm db:migrate && pnpm db:seed` before `pnpm dev` or `pnpm build`; the build prerenders pages from the database.

## Architecture

Next.js 16 App Router app (React 19, Tailwind v4) under `src/`, with `@/*` aliased to `src/*`. The storefront has a home page (`src/app/page.tsx`), a new arrivals listing (`src/app/collections/new/page.tsx`), a category collection page (`src/app/collections/[slug]/page.tsx`, sharing `ProductListing` with new arrivals) and a product detail page (`src/app/products/[slug]/page.tsx`), all fed by the catalogue tables in Postgres; `src/app/not-found.tsx` is the 404 page; sign-in, sign-up and account pages sit on Better Auth.

- **Database** — `src/db/index.ts` exports a single `db`: Drizzle over Neon's HTTP driver (`drizzle-orm/neon-http`). The HTTP driver is stateless per query, so interactive `db.transaction()` is not available; use `db.batch()` or switch drivers if transactions are needed. All tables belong in `src/db/schema.ts`, which is both passed to `drizzle()` and the drizzle-kit schema source. It holds `categories`, `products` and `stock` (one row per product, or one per size; `size` is null for unsized products and a product's total is the sum of its rows). Prices are integer cents. Schema changes go through `db:generate` and `db:migrate`; the SQL in `./drizzle` is committed.
- **Catalogue queries** — `src/db/queries.ts` is the only place pages read the catalogue (`getNavigation`, `getCollections`, `getNewArrivals`, `getLatestProducts`, `getCollection`, `getCollectionSlugs`, `getProduct`, `getRelated`, `getProductSlugs`). It is `server-only`, so client components cannot import it. Every function is `"use cache"` with `cacheLife("hours")` and `cacheTag("catalogue")`; revalidate that tag after any write to these tables.
- **Auth** — Better Auth. `src/lib/auth.ts` is the server instance (Drizzle adapter, `provider: "pg"`, `nextCookies()` last in `plugins`), `src/lib/auth-client.ts` is the React client, and `src/app/api/auth/[...all]/route.ts` mounts the handler. Its tables (`user`, `session`, `account`, `verification`) are in `src/db/schema.ts` under Better Auth's default names, which is how the adapter finds them. Email and password is enabled (no email verification or password reset: there is no mail provider); Google is enabled only when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set, and `googleEnabled` tells the forms whether to show its button. Server code reads the customer through `getCurrentUser()` in `src/lib/session.ts` (`server-only`; returns `{ id, name, email }` or null), which reads the request and so must be called behind `<Suspense>`. Routes: `/sign-in` and `/sign-up` (static, sharing the client `AuthForm`) and `/account` (redirects to `/sign-in` when signed out).
- **Next config** (`next.config.ts`) — `cacheComponents: true` and `partialPrefetching: true` are on. These change rendering and caching rules (e.g. uncached/request-time data access must sit behind `<Suspense>` or `"use cache"`), which affects how session reads and DB queries can be placed in pages and layouts. Read `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`, `migrating-to-cache-components.md`, and `adopting-partial-prefetching.md` before adding data-fetching routes.
- **Tailwind** — v4, loaded through a Turbopack rule using `@tailwindcss/turbopack` in `next.config.ts` rather than a PostCSS config. `src/app/globals.css` only imports the design system in `src/styles/`.
- **Design system** (`src/styles/`) — `tokens.css` (colour, spacing, motion, `@theme`), `base.css`, `typography.css` (`type-*`), `layout.css` (`container-page`, `product-grid`, `media`, ...) and `components.css` (`btn`, `link`, `product-card`, `header-bar`). Everything is a Tailwind `@utility`, so it is only emitted when used and accepts variants. Build UI from these before reaching for raw utilities: monochrome tokens only, square corners, no shadows except `shadow-float`, uppercase titles, one 800ms `ease-brand` motion. `dark:` is remapped to the `.theme-inverse` scope and does not follow the OS setting.
- **Storefront content** — `src/data/storefront.ts` holds editorial content only (hero, feature, stories, services, the static footer columns) and the display helpers `getStockState` and `formatPrice` (takes cents). Links in the header and the footer Shop column come from `getNavigation()` (one per `categories` row, including the product-less `new` row behind the New arrivals link), not from this file. Sample imagery is from Unsplash, allowed through `images.remotePatterns` in `next.config.ts`. Shared UI lives in `src/components/` (`SiteHeader` is a server component that fetches the category links and renders the client `SiteHeaderBar`; both it and `SiteFooter` are rendered by the root layout, so pages (including not-found) do not render them; a page that opens with a full-bleed hero renders `<HeaderOverlay />` to float the header over it, styled through the `over-hero:` variant). Search and bag routes are linked but do not exist yet, and the editorial links (`/collections/leather`, `evening`, `tailoring`) have no matching category.
