# SAZAN

SAZAN is a bilingual (Persian/English) digital product agency website built with Nuxt 4, Vue 3, TypeScript, UnoCSS, Nuxt UI, `@nuxtjs/i18n`, and MongoDB-ready Nitro server utilities. It includes the public marketing site, portfolio/case-study experience, guided project-request flow, contact page, and a small protected internal admin panel.

## Project context

Developers and AI agents should read [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) before making significant changes. It is the main source of truth for current architecture, routes, APIs, data models, design tokens, fallback behavior, and extension conventions.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

The development server binds to `0.0.0.0` for preview environments.

## Commands

- `npm run dev` — start Nuxt in development mode
- `npm run typecheck` — run Nuxt/Vue TypeScript checks
- `npm run build` — create a production build
- `npm run preview` — preview the production output
- `npm audit --omit=dev` — audit production dependencies

## Environment variables

Required for production admin access:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=change-this-long-random-secret
ADMIN_SESSION_MAX_AGE_SECONDS=28800
```

Public/site configuration:

```bash
NUXT_PUBLIC_SITE_URL=https://sazan.studio
NUXT_PUBLIC_CONTACT_EMAIL=hello@sazan.studio
NUXT_PUBLIC_CONTACT_WHATSAPP=
NUXT_PUBLIC_CONTACT_TELEGRAM=
NUXT_PUBLIC_CONTACT_PHONE=
NUXT_PUBLIC_SOCIAL_LINKEDIN=
NUXT_PUBLIC_SOCIAL_BEHANCE=
NUXT_PUBLIC_SOCIAL_DRIBBBLE=
```

MongoDB is optional in development. When `MONGODB_URI` is not configured, the public portfolio keeps using local mock data and admin content uses an in-memory fallback seeded from the same data.

```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=sazan
```

Project-request notifications are optional. Without a webhook, requests are still accepted; development logs are used only outside production.

```bash
NOTIFICATION_WEBHOOK_URL=
NOTIFICATION_WEBHOOK_TOKEN=
NOTIFICATION_WEBHOOK_PROVIDER_NAME=webhook
```

Media storage defaults to local development uploads. MinIO credentials remain server-only and are reserved for the future adapter.

```bash
STORAGE_PROVIDER=local
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=sazan-media
```

## Admin panel

The internal admin panel is available at `/admin`. It uses environment-based credentials, signed HTTP-only cookies, and server-side API authorization. There is no registration, RBAC, or multi-user management.

Admin tools include:

- Dashboard counts and recent items
- Project CRUD, publish/unpublish, featured toggle, preview links, media references, pricing, timeline, links, and localized content
- Category CRUD with order and enabled state
- Service CRUD with icon, active state, featured flag, and order
- Project request review with status updates, archive, and delete
- Public contact/social settings

## Production notes

- Set `NUXT_PUBLIC_SITE_URL` to the canonical production origin so canonical links, sitemap, robots, and structured data are correct.
- Use strong admin credentials and a long random `ADMIN_SESSION_SECRET`.
- Keep MongoDB, MinIO, webhook tokens, and session secrets out of public runtime config.
- `/admin` and `/api/admin/*` are excluded from robots and protected server-side.
- Uploaded local media is written under `public/uploads/admin` and ignored by Git; use persistent storage for production deployments.

## Project structure

- `app/components` — reusable UI, layout primitives, homepage, and portfolio components
- `app/pages` — localized public pages and unlocalized admin pages
- `app/layouts` — public and admin layouts
- `app/composables` — theme, direction, SEO, admin helpers, and formatting utilities
- `app/data` — local homepage, portfolio, and lead-flow content
- `i18n` — English and Persian messages
- `server/api` — public and protected Nitro API routes
- `server/routes` — robots and sitemap routes
- `server/models` — MongoDB collection accessors
- `server/utils` — auth, validation, storage, data, notifications, and MongoDB utilities
- `types` — shared domain models
