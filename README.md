# SAZAN

SAZAN is a bilingual portfolio and lead-generation website for a premium digital product agency. The current implementation includes the Phase 1 foundation, Phase 2 homepage/design-system layer, and Phase 3 public portfolio experience built with Nuxt 4, Vue 3, TypeScript, UnoCSS, Nuxt UI, @nuxtjs/i18n, and MongoDB-ready server utilities.

## Development

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0` for Arena live previews.

## Scripts

- `npm run dev` — start Nuxt in development mode
- `npm run build` — production build
- `npm run preview` — preview the production output
- `npm run typecheck` — run Nuxt/Vue TypeScript checks

## Environment

Copy `.env.example` to `.env` when database-backed features are needed.

```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=sazan
```

MinIO-related variables are included only as a future-ready storage foundation; the media system is not implemented yet.

## Structure

- `app/components` — reusable UI, layout primitives, and homepage sections
- `app/data` — local content metadata for homepage sections and portfolio case studies
- `app/layouts` — application layouts
- `app/pages` — route pages
- `app/composables` — app state/utilities such as theme, locale direction, and digit formatting
- `app/utils` — shared app utilities
- `i18n` — scalable locale messages and Vue I18n config
- `server/api` — Nitro API routes
- `server/models` — MongoDB collection accessors
- `server/utils` — server-only integrations such as MongoDB/storage config
- `types` — domain models shared by app and server code

## Current scope

Implemented:

- Bilingual `/fa` and `/en` routes with RTL/LTR document direction
- Persistent light/dark/system theme handling with semantic design tokens
- Polished responsive header and footer
- Complete homepage sections: hero, selected work preview, services, process, agency statement, and project CTA
- Local mock project metadata for homepage previews
- Public portfolio listing at localized `/projects` routes with category filtering
- Dynamic project detail/case-study pages with metadata, visuals, gallery, optional video, links, and related projects
- Locale-aware `/projects` redirect middleware for direct unprefixed portfolio access

Intentionally left for later phases:

- Project request flow
- Admin panel and authentication
- Media upload/storage implementation
- Database-backed content APIs beyond the health/foundation utilities
