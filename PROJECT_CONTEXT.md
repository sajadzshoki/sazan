# SAZAN — Project Context Documentation

This file is the main technical/product source of truth for SAZAN after the completed implementation phases. It documents what exists in the current codebase. Do not treat it as a feature wishlist.

## 1. Project Overview

SAZAN is a bilingual Persian/English digital product agency website. It serves two connected purposes:

1. **Premium agency portfolio** — present SAZAN as a polished, technically capable product studio through editorial homepage sections, selected work, portfolio filters, and case-study detail pages.
2. **Lead-generation platform** — guide potential customers into a low-friction Start a Project flow and store project requests for admin review.

The site is used to explain SAZAN's work, services, process, and contact channels, then convert interested visitors into qualified project requests.

**Target audience:** ambitious founders, product teams, businesses, startups, and organizations that need crafted digital products for Persian-speaking and international audiences.

**Main business goal:** generate qualified leads for digital product work by combining credibility-building portfolio content with an approachable project-request journey.

**Main public journey:**

```text
Visitor
→ Home
→ Services / Selected Work / Process
→ Projects listing
→ Project detail
→ Start a Project or Contact
→ Project request submitted
→ Admin reviews and follows up
```

**Main services represented in the product:**

| Public/business service | Code/data key |
| --- | --- |
| Web Design & Development / Websites | `websites` |
| Web Applications | `webApps` |
| Mobile Applications | `mobileApps` |
| E-commerce | `ecommerce` |
| Admin Panels | `adminPanels` |
| Backend / API Development / Backend Systems | `backendSystems` |

## 2. Tech Stack

Top-level dependencies are defined in `package.json`; exact installed versions below are from `package-lock.json` at the time this document was created.

| Technology | Installed version | Purpose |
| --- | ---: | --- |
| Nuxt | `4.5.2` | Full-stack Vue application framework, app routing, SSR, Nitro server APIs. |
| Vue | `3.5.42` | Component/runtime layer for public and admin UI. |
| TypeScript | `5.9.3` | Strict typing across app, server, and shared models. |
| UnoCSS / `@unocss/nuxt` | `66.8.1` | Utility CSS engine, shortcuts, semantic token mapping. |
| Nuxt UI (`@nuxt/ui`) | `4.11.0` | Provides `UApp` shell and Nuxt UI integration; fonts/color mode are disabled in favor of SAZAN's custom theme. |
| `@nuxtjs/i18n` | `10.6.0` | Locale-prefixed routing, translation messages, locale cookie helpers. |
| MongoDB Node driver (`mongodb`) | `7.6.0` | Optional server-side persistence for admin data, project requests, and site settings. |
| `vue-router` | `5.3.0` | Router dependency used by Nuxt/Vue. |
| `vue-tsc` | `3.3.11` | Type checking for Vue SFCs through `nuxt typecheck`. |
| `@types/node` | `26.4.0` | Node typings for server utilities. |

Authentication is custom and implemented in `server/utils/admin-auth.ts`: environment-configured admin credentials, HMAC-signed HTTP-only cookie sessions, and server-side API authorization. No external auth package is installed.

Important configuration details:

- `nuxt.config.ts` enables Nuxt modules, i18n, runtime config, strict TypeScript, initial head metadata, and the theme bootstrap script.
- `uno.config.ts` defines semantic color tokens, radius tokens, spacing aliases, and shared shortcuts.
- `app.config.ts` configures Nuxt UI color names (`primary: orange`, `neutral: stone`).
- `.npmrc` contains `legacy-peer-deps=true`.
- `package.json` has an override for `fontless` → `esbuild`.

## 3. Project Architecture

SAZAN uses the Nuxt 4 app directory structure with a clear separation between browser-facing code and Nitro server code.

| Path | Responsibility |
| --- | --- |
| `app/` | Nuxt application source: root app, layouts, pages, components, composables, plugins, data, styles, middleware, utilities. |
| `app/components/` | Reusable public UI components plus homepage and portfolio component groups. |
| `app/pages/` | Route pages for localized public pages and unlocalized admin pages. |
| `app/layouts/` | `default.vue` public layout and `admin.vue` admin workspace layout. |
| `app/composables/` | Shared client/app logic: theme, direction, locale digits, portfolio localization, public SEO, admin helpers. |
| `app/data/` | Static/local content for homepage services/process/navigation, lead-flow options, and public portfolio projects. |
| `app/assets/css/main.css` | Global design tokens, typography classes, reusable CSS utilities, admin classes, motion and responsive helpers. |
| `app/middleware/` | Nuxt route middleware. Currently includes global admin route guard. |
| `app/plugins/` | Client plugin for theme initialization. |
| `types/` | Shared TypeScript domain models used by app and server. |
| `server/` | Nitro server implementation. |
| `server/api/` | Public and protected API endpoints. |
| `server/routes/` | Non-API Nitro routes for `robots.txt` and `sitemap.xml`. |
| `server/models/` | MongoDB collection accessors and collection-name constants. |
| `server/utils/` | Server utilities for admin auth, input validation/sanitization, data access, MongoDB connection, notifications, storage. |
| `i18n/` | Vue I18n config and English/Persian message files. |
| `public/` | Static assets: favicon, OG image, web manifest, and runtime local uploads under ignored `public/uploads`. |
| Root config files | Nuxt, UnoCSS, TypeScript, package, npm, gitignore, env example, README. |

### Important architectural decisions

- **Nuxt 4 app directory:** pages, layouts, middleware, plugins, and composables live under `app/`.
- **Server/client separation:** MongoDB, admin secrets, notification webhook tokens, and storage credentials are only accessed in server code or private runtime config. Client code calls API endpoints instead of importing server utilities.
- **Data-access abstraction:** `server/utils/admin-data.ts` exposes CRUD-style functions and chooses MongoDB or in-memory fallback based on whether `MONGODB_URI` is configured.
- **Public portfolio source:** public portfolio pages currently read static local data from `app/data/projects.ts` through `usePortfolio()`. They do **not** currently fetch admin/Mongo project records at runtime.
- **Admin data seed:** when MongoDB is not configured, admin project/category/service data is seeded in memory from the local public data.
- **Semantic design tokens:** colors, spacing, radius, shadows, and key text styles are centralized in CSS variables and UnoCSS shortcuts.
- **Locale-prefixed public routing:** public routes use `/fa` and `/en` prefixes via `@nuxtjs/i18n` strategy `prefix`.
- **Unlocalized admin routing:** admin pages call `defineI18nRoute(false)` and live at `/admin/*`; admin language changes do not change the admin URL.

## 4. Routing

### Public page routes

With i18n strategy `prefix`, public pages are available under both `/fa` and `/en`.

| Route | Page file | Purpose |
| --- | --- | --- |
| `/` | generated/i18n root behavior | Root uses browser/cookie locale detection and redirects to a localized route when applicable. |
| `/fa`, `/en` | `app/pages/index.vue` | Homepage: hero, selected work, services, process, statement, CTA. |
| `/fa/projects`, `/en/projects` | `app/pages/projects/index.vue` | Portfolio listing with category filter query. |
| `/fa/projects?category=<filter>`, `/en/projects?category=<filter>` | `app/pages/projects/index.vue` | Filtered portfolio listing. Valid filters come from `portfolioFilters`. |
| `/fa/projects/:slug`, `/en/projects/:slug` | `app/pages/projects/[slug].vue` | Project/case-study detail page for slugs in `app/data/projects.ts`. |
| `/fa/contact`, `/en/contact` | `app/pages/contact.vue` | Contact directory and CTA. No contact form endpoint exists. |
| `/fa/start-a-project`, `/en/start-a-project` | `app/pages/start-a-project.vue` | Guided project-request flow. |
| unmatched app route | `app/pages/[...slug].vue` + `app/error.vue` | 404 handling with bilingual error page. |

`server/middleware/portfolio-locale-redirect.ts` redirects unprefixed public routes `/projects`, `/projects/*`, `/contact`, and `/start-a-project` to `/<locale>...` using the `sazan_locale` cookie or `fa` fallback.

### Admin page routes

Admin routes are not locale-prefixed.

| Route | Page/layout | Purpose | Auth behavior |
| --- | --- | --- | --- |
| `/admin/login` | `app/pages/admin/login.vue` | Admin sign-in screen. | If already authenticated, route middleware sends the user to `/admin`. |
| `/admin` | `app/pages/admin/index.vue` + `app/layouts/admin.vue` | Admin dashboard. | Requires signed admin session. |
| `/admin/projects` | `app/pages/admin/projects.vue` | Manage project records and cover upload. | Requires signed admin session. |
| `/admin/categories` | `app/pages/admin/categories.vue` | Manage category records. | Requires signed admin session. |
| `/admin/services` | `app/pages/admin/services.vue` | Manage service records. | Requires signed admin session. |
| `/admin/requests` | `app/pages/admin/requests.vue` | Review and update project requests. | Requires signed admin session. |
| `/admin/settings` | `app/pages/admin/settings.vue` | Manage public contact/social settings and view storage status. | Requires signed admin session. |

The global admin route guard is `app/middleware/admin-auth.global.ts`. It calls `/api/admin/auth/session` with cookies during SSR/client navigation and redirects unauthenticated admin users to `/admin/login?redirect=<path>`.

### Server utility routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/robots.txt` | `GET` | Allows public site crawling, disallows `/admin` and `/api/admin`, points to sitemap. |
| `/sitemap.xml` | `GET` | XML sitemap for localized home/projects/contact/start pages and published local portfolio projects, with xhtml alternates. |

### API endpoint reference

All admin API routes require a valid signed admin session unless explicitly marked public.

| Endpoint | Method | Auth | Request structure | Response structure | Validation/notes |
| --- | --- | --- | --- | --- | --- |
| `/api/health` | `GET` | Public | None | `{ ok, service, phase, i18n, database, notifications, storage }` | Diagnostic only. `phase` is currently hardcoded as `lead-generation-flow`. |
| `/api/site-settings` | `GET` | Public | None | `{ contact, updatedAt }` | Reads site settings through admin data layer; falls back to runtime public contact config. |
| `/api/project-requests` | `POST` | Public | Project request payload; see Sections 10–11. | `{ ok: true, reference: string }` | Server validates/sanitizes fields, persists first, then sends notification. Notification failure does not block success. |
| `/api/admin/auth/session` | `GET` | Public endpoint, reads cookie | Cookie only | `{ authenticated, configured, admin }` where `admin` is `{ email, expiresAt }` or `null` | Does not expose password/session secret. |
| `/api/admin/auth/login` | `POST` | Public endpoint | `{ email: string, password: string }` | `{ ok: true, admin: { email, expiresAt } }` and sets cookie | Requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`; invalid or missing credentials return safe errors. |
| `/api/admin/auth/logout` | `POST` | Public endpoint, clears cookie | None | `{ ok: true }` | Deletes `sazan_admin_session` cookie. |
| `/api/admin/dashboard` | `GET` | Admin | None | `{ admin, data, media, counts, recentProjects, recentRequests }` | Aggregates projects, categories, services, requests, data provider, and media provider status. |
| `/api/admin/projects` | `GET` | Admin | None | `{ projects, categories, services }` | Lists all admin project records, categories, and services. |
| `/api/admin/projects` | `POST` | Admin | Project input payload | `{ ok: true, project }` | Requires localized title/short description and slug; rejects duplicate slug/id with `409`. |
| `/api/admin/projects/:id` | `GET` | Admin | Path `id` | `{ project, categories, services }` | `404` if not found. |
| `/api/admin/projects/:id` | `PATCH` | Admin | Full project input payload | `{ ok: true, project }` | Same project validation as create; rejects duplicate slug for another project. |
| `/api/admin/projects/:id` | `DELETE` | Admin | Path `id` | `{ ok: true }` | `400` if missing id, `404` if not found. UI asks for confirmation before destructive action. |
| `/api/admin/categories` | `GET` | Admin | None | `{ categories }` | Categories are sorted by `order` in the data layer. |
| `/api/admin/categories` | `POST` | Admin | Category input payload | `{ ok: true, category }` | Requires localized title and slug; rejects duplicate slug/id. |
| `/api/admin/categories/:id` | `GET` | Admin | Path `id` | `{ category }` | `404` if not found. |
| `/api/admin/categories/:id` | `PATCH` | Admin | Category input payload | `{ ok: true, category }` | Same validation as create; duplicate slug check. |
| `/api/admin/categories/:id` | `DELETE` | Admin | Path `id` | `{ ok: true }` | `400` if missing id, `404` if not found. |
| `/api/admin/services` | `GET` | Admin | None | `{ services }` | Services are sorted by `order` in the data layer. |
| `/api/admin/services` | `POST` | Admin | Service input payload | `{ ok: true, service }` | Requires localized title, localized short description, and slug; duplicate slug/id check. |
| `/api/admin/services/:id` | `GET` | Admin | Path `id` | `{ service }` | `404` if not found. |
| `/api/admin/services/:id` | `PATCH` | Admin | Service input payload | `{ ok: true, service }` | Same validation as create; duplicate slug check. |
| `/api/admin/services/:id` | `DELETE` | Admin | Path `id` | `{ ok: true }` | `400` if missing id, `404` if not found. |
| `/api/admin/requests` | `GET` | Admin | Optional query `status=<ProjectRequestStatus>` | `{ requests, statuses }` | Invalid/missing status query returns all requests. |
| `/api/admin/requests/:id` | `GET` | Admin | Path `id` | `{ request }` | `404` if not found. |
| `/api/admin/requests/:id` | `PATCH` | Admin | `{ status: ProjectRequestStatus }` | `{ ok: true, request }` | Only status updates are implemented; invalid status returns `400`. |
| `/api/admin/requests/:id` | `DELETE` | Admin | Path `id` | `{ ok: true }` | Deletes a project request; UI asks for confirmation. |
| `/api/admin/settings` | `GET` | Admin | None | `{ settings }` | Reads `SiteSettings` for public contact/social details. |
| `/api/admin/settings` | `PUT` | Admin | Public contact settings payload | `{ ok: true, settings }` | Valid public email required; social URLs sanitized. |
| `/api/admin/media/status` | `GET` | Admin | None | `{ provider, local, minio }` | Reports storage provider and MinIO configuration status without secrets. |
| `/api/admin/media/upload` | `POST` | Admin | Multipart form with field `file` | `{ ok: true, asset }` | Local uploads are implemented; MinIO upload returns `501`. See Section 14. |

#### Admin project input shape

```ts
{
  id?: string
  title: { en: string; fa: string }
  slug: string
  shortDescription: { en: string; fa: string }
  fullDescription?: { en?: string; fa?: string }
  categoryId?: string
  services?: string[]
  technologies?: string[] | string
  coverImageUrl?: string
  coverImageKey?: string
  coverAlt?: { en?: string; fa?: string }
  galleryRefs?: string[] | string
  videoUrl?: string
  demoUrl?: string
  projectUrl?: string
  pricing?: { visibility?: 'public' | 'private' | 'on-request'; currency?: string; min?: number; max?: number; note?: { en?: string; fa?: string } }
  timeline?: { durationWeeks?: number; note?: { en?: string; fa?: string } }
  year?: string
  featured?: boolean
  status?: 'draft' | 'review' | 'published' | 'archived'
}
```

Important project validation/sanitization:

- `slug` is required and sanitized to lowercase letters/numbers/Persian characters separated by hyphens.
- `title.en`, `title.fa`, `shortDescription.en`, and `shortDescription.fa` are required.
- URLs must be `http:`, `https:`, `mailto:`, `tel:`, or relative paths; invalid optional URLs are dropped.
- Text fields are trimmed and control characters are removed.
- String arrays accept arrays or comma/newline-delimited strings and are capped.
- If no technologies are provided, server-side project parsing adds `Nuxt`.

#### Admin category/service/settings input notes

- Category: requires `title.en`, `title.fa`, and `slug`; supports `description`, `order`, and active/enabled/publish status.
- Service: requires `title.en`, `title.fa`, `shortDescription.en`, `shortDescription.fa`, and `slug`; supports `description`, `icon`, `order`, `featured`, and `active`.
- Settings: requires a valid public `email`; optional `phone`, `whatsapp`, `telegram`, and `social.linkedin/behance/dribbble`.

## 5. Internationalization

| Locale | URL code | Language tag | Direction | Role |
| --- | --- | --- | --- | --- |
| Persian | `fa` | `fa-IR` | RTL | Default locale and `x-default` SEO alternate. |
| English | `en` | `en-US` | LTR | Secondary locale. |

Implementation details:

- i18n configuration lives in `nuxt.config.ts` and `i18n/i18n.config.ts`.
- Translation files are `i18n/locales/fa.ts` and `i18n/locales/en.ts`.
- Nuxt i18n strategy is `prefix`, so localized public pages use `/fa/...` and `/en/...`.
- Default locale is `fa`.
- Vue I18n fallback locale is `en`.
- Browser-language detection uses cookie `sazan_locale`, redirects on root only, and falls back to `fa`.
- Additional server middleware redirects unprefixed public routes (`/projects`, `/contact`, `/start-a-project`) to the cookie locale or `fa`.
- `useAppDirection()` derives `dir` and `lang` from locale properties and sets `rtl` for Persian, `ltr` for English.
- `app/app.vue` applies `html` `lang` and `dir` globally.
- `LanguageSwitcher.vue` preserves the current path, query, and hash when switching public locales and sets the locale cookie.
- Admin routes are not locale-prefixed; admin layout/login provide in-place language controls that update i18n state and `sazan_locale` cookie.

When adding translations, update both `fa.ts` and `en.ts` with matching keys. Also ensure any localized content models contain both `fa` and `en` values where required.

## 6. Design System

### Brand

SAZAN's visual language is premium, technical, sharp, youthful, and friendly. The public site uses large editorial typography, abstract product-interface visuals, high-contrast surfaces, precise grid details, rounded cards, and warm/cool accents.

Design principles visible in the codebase:

- Editorial scale for key marketing messages.
- Clean technical grid motifs and abstract UI/product visuals instead of photo-heavy content.
- Clear CTAs with low-friction language.
- Native RTL/LTR layout support using logical properties.
- Semantic color tokens and reusable shortcuts rather than one-off styling.

Primary brand accents:

- Warm primary orange/brown: `--color-primary`.
- Cool teal accent: `--color-accent`.

### Typography

Configured in `app/assets/css/main.css`:

| Token/class | Value/purpose |
| --- | --- |
| `--font-sans` | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| `--font-persian` | `Vazirmatn, IRANSans, Tahoma, var(--font-sans)` |
| `html[dir='rtl']` | Uses Persian font stack. |
| `.sazan-display` | Largest hero display text with responsive `clamp()` sizing and RTL-specific line-height/letter-spacing. |
| `.sazan-heading-xl` | Large section/page headings. |
| `.sazan-heading-lg` | Standard major section headings. |
| `.sazan-body-lg` | Larger muted body copy. |
| `.sazan-title-tight` | Tight-title utility with RTL adjustment. |
| `.sazan-meta` / `.sazan-eyebrow` | Uppercase/meta labels; RTL removes letter-spacing. |

No custom web font files are bundled in the repository; font stacks depend on system/available fonts.

### Colors

Semantic tokens are CSS variables in `main.css` and are mapped into UnoCSS theme colors in `uno.config.ts`.

| Token | Light value | Dark value | Purpose |
| --- | --- | --- | --- |
| `--color-background` | `248 247 243` | `9 10 10` | Page background. |
| `--color-foreground` | `24 23 20` | `246 242 234` | Main text/high-contrast foreground. |
| `--color-muted` | `96 91 82` | `166 158 145` | Secondary text. |
| `--color-border` | `219 214 204` | `55 50 43` | Borders/dividers. |
| `--color-surface` | `255 254 250` | `18 19 19` | Cards/surfaces. |
| `--color-surface-elevated` | `239 234 222` | `31 30 28` | Elevated surfaces. |
| `--color-primary` | `184 81 40` | `238 139 83` | Primary CTA/accent. |
| `--color-accent` | `18 111 104` | `95 209 191` | Secondary accent/success-like highlight. |

Future components should use token-backed classes such as `bg-background`, `text-foreground`, `text-muted`, `border-border`, `bg-surface`, `bg-elevated`, `text-primary`, and `text-accent`. Avoid adding hardcoded colors unless there is a clear reason.

### Spacing and layout

| Token/shortcut | Definition/use |
| --- | --- |
| `--space-gutter` | `clamp(1rem, 2.4vw, 2.75rem)` |
| `--space-section` | `clamp(4.5rem, 8vw, 8rem)` |
| `--space-section-tight` | `clamp(3.25rem, 6vw, 5.75rem)` |
| `.sazan-section` | Applies standard vertical section padding. |
| `.sazan-section-tight` | Applies tighter vertical section padding. |
| `sazan-container` shortcut | `mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-10 xl:px-12` |
| Admin layout max width | `max-w-[104rem]` with `18rem` sidebar on large screens. |

### Radius

Radius variables are defined in `main.css` and mapped in UnoCSS:

| Token | Value |
| --- | ---: |
| `--radius-sm` | `0.375rem` |
| `--radius-md` | `0.625rem` |
| `--radius-lg` | `0.875rem` |
| `--radius-xl` | `1.25rem` |
| `--radius-2xl` | `1.75rem` |
| `--radius-3xl` | `2.5rem` |

Some major marketing surfaces also use explicit large rounded utilities such as `rounded-[2rem]` where present.

### Reusable components

| Component | Responsibility |
| --- | --- |
| `AppHeader.vue` | Sticky public header, skip link, desktop/mobile navigation, language switcher, theme switcher, Start a Project CTA. |
| `AppFooter.vue` | Footer navigation, services list, public contact email/social links from `/api/site-settings`, brand statement. |
| `BaseContainer.vue` | Shared max-width/gutter wrapper. |
| `SazanWordmark.vue` | Brand mark and wordmark, supports compact/inverted modes. |
| `SectionHeading.vue` | Shared eyebrow/title/lead section header. |
| `LanguageSwitcher.vue` | Public locale switcher with cookie/path preservation. |
| `ThemeSwitcher.vue` | Cycles system/light/dark theme preference. |
| `home/HomeHero.vue` | Homepage hero and primary CTAs. |
| `home/HomeSelectedWork.vue` | Homepage selected-work section using featured project data. |
| `home/HomeProjectCard.vue` | Homepage selected-work card. |
| `home/HomeServices.vue` | Homepage services list. |
| `home/HomeProcess.vue` | Homepage four-step process. |
| `home/HomeAgencyStatement.vue` | Dark/foreground brand philosophy section. |
| `home/HomeProjectCta.vue` | Homepage lead-generation CTA. |
| `portfolio/PortfolioProjectCard.vue` | Project listing card with responsive layout classes. |
| `portfolio/PortfolioVisual.vue` | Abstract project visual renderer using tone/composition CSS. |
| `portfolio/ProjectDetailsPanel.vue` | Case-study metadata panel. |
| `portfolio/ProjectGallery.vue` | Responsive project gallery with abstract visuals and captions. |
| `portfolio/ProjectVideo.vue` | Lightweight video placeholder section. |
| `portfolio/RelatedProjects.vue` | Related-project links selected by portfolio logic. |

Admin UI does not have a separate reusable component directory. It uses `app/layouts/admin.vue`, admin pages, and shared CSS classes such as `.admin-card`, `.admin-input`, `.admin-textarea`, `.admin-table`, `.admin-badge`, `.admin-action`, `.admin-empty`, and `.admin-alert`.

## 7. Responsive Design

The visual direction is desktop/laptop premium, but the implementation is mobile-safe with responsive enhancements at UnoCSS/Tailwind-style breakpoints. No custom breakpoints are defined; `presetUno` defaults are used (`sm`, `md`, `lg`, `xl`, etc.).

Key responsive behavior:

- Public container: `sazan-container` keeps consistent side gutters and caps content at `86rem`.
- Public header: desktop nav appears at `lg`; mobile uses a toggle button and collapsible menu.
- Hero and major sections: generally single-column on mobile, multi-column at `lg`.
- Portfolio filters: horizontal scroll strip with hidden scrollbars for narrow screens.
- Portfolio listing: uses a 12-column layout at `lg`; cards choose spans based on project `layout` (`feature`, `portrait`, `landscape`, `standard`).
- Project gallery: `wide`, `landscape`, `portrait`, and `square` items span a 12-column grid on desktop; all collapse to one column below `lg`.
- Start a Project: sidebar/progress and form become two-column at `lg`; controls stack on mobile.
- Admin layout: mobile top bar + slide-out drawer below `lg`; fixed/sticky sidebar at `lg` and above.
- Admin tables: wrapped in horizontal overflow containers and have a minimum width to preserve readability.

Developer conventions:

- Start with a readable mobile base, then enhance with `sm:`, `md:`, `lg:`, `xl:` utilities.
- Use `min-w-0`, `overflow-x-auto`, wrapping, and logical spacing to avoid overflow.
- Preserve RTL/LTR by using logical utilities/properties (`start`, `end`, `border-s`, `border-e`, `ps`, `pe`, `ms`, `me`).

## 8. Theme System

Theme logic is custom and lives in `useAppTheme()` plus `app/plugins/theme.client.ts` and the bootstrap script in `nuxt.config.ts`.

Supported preferences:

- `system`
- `light`
- `dark`

Implementation details:

- Preference is stored in `localStorage` under key `sazan-theme`.
- Default preference is `system`.
- The bootstrap script in `nuxt.config.ts` runs in the document head before hydration to prevent theme flash.
- Resolved theme is applied to `document.documentElement` using:
  - `data-theme="light" | "dark"`
  - `.dark` class toggle
  - `style.colorScheme`
- `system` uses `window.matchMedia('(prefers-color-scheme: dark)')` and updates when the OS preference changes.
- Semantic color tokens change under `:root.dark` / `:root[data-theme='dark']`.

Future components must rely on semantic token-backed classes and test both light and dark themes. Do not introduce a second color-mode system.

## 9. Public Portfolio Logic

Public portfolio logic is implemented in:

- `app/data/projects.ts` — local project dataset and project helper functions.
- `app/composables/usePortfolio.ts` — locale-aware project localization and public computed helpers.
- `app/pages/projects/index.vue` — listing/filter UI.
- `app/pages/projects/[slug].vue` — detail route.
- `app/components/portfolio/*` — project cards, visuals, details, gallery, video placeholder, related projects.

### Current public data source

The public portfolio currently reads from local static data in `app/data/projects.ts`. It does not call an API and does not currently read MongoDB/admin project records at runtime.

The local portfolio dataset currently contains 15 projects, all marked `published`; the first five are `featured` and shown in the homepage selected-work data:

- `atlas-commerce-studio`
- `nova-health-portal`
- `pulse-finance-mobile`
- `bazaar-editorial-shop`
- `panelix-operations-os`
- `orion-cloud-console`
- `lumin-architecture-website`
- `craftline-booking-platform`
- `seedlink-marketplace`
- `rhythm-learning-app`
- `caspian-logistics-backend`
- `northstar-studio-website`
- `mina-analytics-admin`
- `verdant-commerce-mobile`
- `helio-api-platform`

### Project model concepts

Public `PortfolioProject` includes:

- `id`, `slug`
- localized `title`, `shortDescription`, `fullDescription`
- `category`
- `services`
- `technologies`
- `coverVisual` and `gallery` abstract visual descriptors
- optional `video` placeholder metadata
- optional `demoUrl`, `projectUrl`
- optional `pricing`, `timeline`
- `year`
- `featured`
- `status`
- localized `overview`, `challenge`, `solution`, `keyFeatures`, `results`
- card `layout`

### Categories and filters

`portfolioCategories` equals the six service/category keys:

```text
websites, webApps, mobileApps, ecommerce, adminPanels, backendSystems
```

`portfolioFilters` is:

```text
all + portfolioCategories
```

The listing page reads the query string `category`; invalid or missing values fall back to `all`.

### Visibility and related projects

- `usePortfolio().projects` only exposes projects with `status === 'published'`.
- `featuredProjects` filters the published projects by `featured === true`.
- `getProjectBySlug(slug)` returns a localized project for any matching local project. The detail page itself does not additionally check publication status.
- `getRelatedPortfolioProjects(project, limit)` excludes the current slug, includes only published candidates, scores same-category projects with `+10`, adds service-overlap count, adds `+1` if featured, sorts descending, and returns the first `limit` projects.

### Admin/Mongo distinction

The admin project CRUD model is intentionally similar to the public project concepts and is seeded from local portfolio data when MongoDB is absent. However, admin/Mongo project records are not currently the runtime source for public portfolio pages. Connecting public portfolio pages to the admin/Mongo data layer would be future architecture work.

## 10. Start a Project Flow

The Start a Project page is `app/pages/start-a-project.vue`. It is a guided, low-friction lead form. The UX philosophy is that customers should not need a perfect brief before contacting SAZAN: most questions can be skipped, and only basic contact information blocks submission.

### Steps

| Step | Key | Required? | Data collected |
| ---: | --- | --- | --- |
| 1 | `projectTypes` | Optional | One or more project types. `notSure` is exclusive in the client UI. |
| 2 | `idea` | Optional | Free-text business/product/challenge description. |
| 3 | `features` | Optional | One or more requested capabilities. `notSure` is exclusive in the client UI. |
| 4 | `budget` | Optional | One budget range. Clicking the selected value clears it. |
| 5 | `timeline` | Optional | One timeline value. Clicking the selected value clears it. |
| 6 | `contact` | Required fields only | Full name and email required; phone, company, preferred contact method optional. |
| 7 | `review` | Required before submit | Displays only completed optional answers plus contact details; user can edit steps. |
| 8 | submission | Runtime action | Calls `/api/project-requests`. |
| 9 | success | Runtime state | Shows success message and first 8 characters of the reference UUID. |

### Allowed options

Project type values:

```text
website, webApplication, mobileApplication, ecommerce, adminPanel, backendApi, somethingElse, notSure
```

Feature values:

```text
uiUxDesign, authentication, payments, dashboard, adminPanel, apiIntegration, ecommerce, aiFeatures, other, notSure
```

Budget values:

```text
under-2k, 2k-5k, 5k-10k, 10k-25k, 25k-plus, not-sure
```

Timeline values:

```text
asap, within-1-month, 1-3-months, flexible, not-sure
```

Preferred contact method values:

```text
email, whatsapp, telegram, phone
```

### Validation and submission

Client-side validation:

- `contact.fullName` is required.
- `contact.email` is required and must match a basic email pattern.
- Submit is guarded against duplicate submissions while already submitting or after success.
- Optional steps can be skipped.

Server-side validation in `server/api/project-requests.post.ts`:

- Revalidates full name and email.
- Validates email with basic pattern.
- Rejects invalid selections/options with a `400` validation error.
- Deduplicates allowed multi-selections and caps them at 10.
- Sanitizes and truncates strings:
  - full name: 100 chars
  - email: 254 chars
  - phone: 60 chars
  - company: 120 chars
  - business description: 3000 chars
- Normalizes locale to `en` or `fa`; any non-`en` value becomes `fa`.

Submission flow:

```text
Start a Project page
→ client validates required contact fields
→ POST /api/project-requests
→ server sanitizes and validates payload
→ ProjectRequest record is created with status=new and notificationStatus=pending
→ data layer stores in MongoDB or memory fallback
→ notification abstraction sends webhook or skips/logs fallback
→ record notificationStatus is updated to sent/skipped/failed
→ API returns { ok: true, reference }
→ success state is shown
```

Notification failures do not invalidate a saved project request.

## 11. Project Request Data Model

Defined in `types/models.ts` as `ProjectRequest` and related types.

| Field | Type | Required? | Purpose/default |
| --- | --- | --- | --- |
| `id` | `string` | Set by server | UUID reference generated on submission. |
| `createdAt` | `Date` | Set by server | Creation timestamp. |
| `updatedAt` | `Date` | Set by server | Last update timestamp. |
| `selectedProjectTypes` | `ProjectRequestProjectType[]` | Present, may be empty | Optional selected build types. |
| `businessDescription` | `string` | Optional | Free-text idea/context, max 3000 chars from public API. |
| `requestedFeatures` | `ProjectRequestFeature[]` | Present, may be empty | Optional selected capabilities. |
| `budgetRange` | `ProjectRequestBudgetRange` | Optional | Optional budget range. |
| `timeline` | `ProjectRequestTimeline` | Optional | Optional desired timeline. |
| `contact.fullName` | `string` | Required | Customer name. |
| `contact.email` | `string` | Required | Customer email, lowercased by server. |
| `contact.phone` | `string` | Optional | Customer phone. |
| `contact.company` | `string` | Optional | Company/studio name. |
| `contact.preferredContactMethod` | `PreferredContactMethod` | Optional | Preferred first response channel. |
| `preferredLocale` | `'fa' | 'en'` | Set by server | Locale submitted by client, normalized. |
| `source` | `string` | Set by server | Currently `website-start-a-project`. |
| `status` | `ProjectRequestStatus` | Set by server/admin | Default `new`; admin can update. |
| `notificationStatus` | `'pending' | 'sent' | 'skipped' | 'failed'` | Set by server | Starts `pending`, updated after notification attempt. |
| `userAgent` | `string` | Optional | Request `user-agent` header if present. |

Allowed project request statuses:

```text
new, reviewing, contacted, inProgress, completed, archived
```

Allowed notification statuses:

```text
pending, sent, skipped, failed
```

## 12. Admin System

The admin panel is an internal, practical content and request-management workspace. It intentionally does not include public registration, multi-user RBAC, analytics, browser push notifications, or a complex CMS.

### Authentication and session handling

Implemented in `server/utils/admin-auth.ts` and `app/middleware/admin-auth.global.ts`.

- Credentials come from environment variables:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - optional `ADMIN_SESSION_MAX_AGE_SECONDS`
- Login verifies credentials server-side.
- Sessions are stored in an HTTP-only cookie named `sazan_admin_session`.
- Cookie payload includes admin email, `sessionId`, `issuedAt`, and `expiresAt`.
- Payload is HMAC-SHA256 signed with `ADMIN_SESSION_SECRET`.
- Cookie options: `httpOnly`, `sameSite: 'lax'`, `path: '/'`, `maxAge`; `secure` is true in production.
- Authentication checks happen on the server for every admin API route via `requireAdminSession(event)`.
- Route middleware protects admin pages and redirects unauthenticated users to login.
- Logout clears the admin session cookie.
- There is no separate server-side session store or role system in the current implementation.

### Admin sections

| Section | Route | Capabilities |
| --- | --- | --- |
| Login | `/admin/login` | Sign in with env-configured credentials; shows not-configured warning if admin auth env is missing. |
| Dashboard | `/admin` | View counts, recent projects, recent requests, data provider, media provider, MinIO status. |
| Projects | `/admin/projects` | Create, edit, delete, publish/unpublish, feature/unfeature, preview project URL, upload/attach cover, edit localized content, technologies, category, services, media refs, links, pricing, timeline. |
| Categories | `/admin/categories` | Create, edit, delete, enable/disable via publish status, edit localized title/description, order. |
| Services | `/admin/services` | Create, edit, delete, enable/disable active services, edit localized content, icon, order, featured flag. |
| Project Requests | `/admin/requests` | List/filter requests, view detail, change status, archive by setting status `archived`, delete. |
| Settings | `/admin/settings` | Edit public contact email/phone/WhatsApp/Telegram and social links; view storage provider status. |

Destructive actions in admin pages use browser confirmation dialogs before delete.

## 13. MongoDB

MongoDB access is server-only and implemented with the official MongoDB driver.

### Connection architecture

- `server/utils/mongodb.ts` reads `MONGODB_URI` and `MONGODB_DATABASE` from environment/runtime config.
- `getMongoClient()` creates a `MongoClient` and caches the connection promise on `globalThis.__sazanMongoClientPromise`.
- `getMongoDatabase()` returns `client.db(databaseName)`.
- If no `MONGODB_URI` is configured, data-layer helpers use memory fallback instead of attempting MongoDB.
- If `MONGODB_URI` is configured but the database is unreachable, MongoDB-backed APIs can fail; there is no automatic fallback in that case.

### Collection accessors

Defined in `server/models/index.ts`:

| Constant key | Collection name | Current usage |
| --- | --- | --- |
| `projects` | `projects` | Admin project CRUD when MongoDB is configured. |
| `categories` | `categories` | Admin category CRUD when MongoDB is configured. |
| `services` | `services` | Admin service CRUD when MongoDB is configured. |
| `projectRequests` | `project_requests` | Public project-request storage and admin request management. |
| `siteSettings` | `site_settings` | Public contact/social settings. |
| `contactMessages` | `contact_messages` | Collection accessor/model exists, but no public contact-message API or UI currently writes to it. |

### Fallback behavior

When `MONGODB_URI` is absent:

- Admin projects are seeded from `app/data/projects.ts`.
- Admin categories are seeded from `portfolioCategories`.
- Admin services are seeded from `app/data/home.ts` services.
- Project requests are stored in process memory.
- Site settings are stored in process memory and seeded from public runtime contact config.

Memory fallback is useful for development and previews but is not persistent across process restarts.

MongoDB must never be accessed directly from client-side code.

## 14. Media / Storage

Media storage is implemented in `server/utils/storage.ts` and admin media endpoints.

### What is implemented

- Storage provider config supports `local` and `minio` as provider names.
- `local` provider is implemented.
- Admin upload endpoint accepts multipart form field `file` at `/api/admin/media/upload`.
- Local uploads are written to:

```text
public/uploads/admin/YYYY-MM-DD/<uuid>.<ext>
```

- Public URL returned for local upload:

```text
/uploads/admin/YYYY-MM-DD/<uuid>.<ext>
```

- `public/uploads` is ignored by Git.
- Media status endpoint returns provider status without exposing secrets.

Allowed MIME types:

```text
image/jpeg, image/png, image/webp, image/gif, video/mp4, video/webm, application/pdf
```

Max upload size: `8 MB`.

### MinIO preparation

MinIO is prepared in config and status reporting, but the upload adapter is **not implemented**. If `STORAGE_PROVIDER=minio`, upload attempts return `501` with a safe message. Future MinIO work should be implemented inside `server/utils/storage.ts` without exposing access keys to the client.

## 15. Notifications

Notification logic is implemented in `server/utils/notifications.ts`.

### Current provider architecture

- A `NotificationProvider` shape defines `name`, `isConfigured()`, and `sendProjectRequest()`.
- Current implemented provider factory: webhook provider.
- The webhook provider sends `POST` JSON to `NOTIFICATION_WEBHOOK_URL`.
- If `NOTIFICATION_WEBHOOK_TOKEN` is set, it is sent as `Authorization: Bearer <token>`.
- `NOTIFICATION_WEBHOOK_PROVIDER_NAME` controls provider display/name, defaulting to `webhook`.

Webhook payload shape:

```json
{
  "type": "project_request.created",
  "data": {
    "reference": "uuid",
    "locale": "fa-or-en",
    "status": "new",
    "projectTypes": [],
    "requestedFeatures": [],
    "budgetRange": "optional",
    "timeline": "optional",
    "contact": {
      "fullName": "Customer Name",
      "email": "customer@example.com",
      "company": "optional",
      "preferredContactMethod": "optional"
    },
    "createdAt": "timestamp"
  }
}
```

The summary intentionally omits phone number and business description.

### Fallback/failure behavior

- If no provider is configured, development mode logs a safe summary to the console and returns a skipped result.
- In production with no provider configured, it skips without development logging.
- If a configured provider fails, the error is logged server-side and the result is marked failed.
- Project request submission is considered successful as long as persistence succeeds; notification failure only updates `notificationStatus` to `failed`.
- There is no retry queue in the current implementation.

## 16. Environment Variables

All variables currently used by the app are listed below. Never commit real secrets.

| Name | Purpose | Required/optional | Example format | Scope |
| --- | --- | --- | --- | --- |
| `NODE_ENV` | Enables production behavior such as secure cookies, disables devtools in production, suppresses dev notification logging. | Set by runtime/build environment | `production` | Server/build/runtime |
| `MONGODB_URI` | MongoDB connection URI. Enables Mongo-backed admin/request/settings storage when present. | Optional in development; required for persistent production data. | `mongodb://localhost:27017` or `mongodb+srv://...` | Server-only |
| `MONGODB_DATABASE` | MongoDB database name. | Optional; defaults to `sazan`. | `sazan` | Server-only |
| `ADMIN_EMAIL` | Admin login email. | Required for admin login. | `admin@example.com` | Server-only |
| `ADMIN_PASSWORD` | Admin login password. | Required for admin login. | `change-this-password` | Server-only |
| `ADMIN_SESSION_SECRET` | HMAC secret used to sign admin session cookies. | Required for admin login. | `long-random-secret` | Server-only |
| `ADMIN_SESSION_MAX_AGE_SECONDS` | Admin cookie lifetime. | Optional; defaults to 8 hours (`28800`). | `28800` | Server-only |
| `NOTIFICATION_WEBHOOK_URL` | Webhook endpoint for project-request notifications. | Optional. | `https://example.com/webhook` | Server-only |
| `NOTIFICATION_WEBHOOK_TOKEN` | Bearer token for webhook notification auth. | Optional. | `secret-token` | Server-only |
| `NOTIFICATION_WEBHOOK_PROVIDER_NAME` | Provider name shown in results/logs. | Optional; defaults to `webhook`. | `webhook` | Server-only |
| `STORAGE_PROVIDER` | Media storage provider. | Optional; defaults to `local`. | `local` or `minio` | Server-only |
| `MINIO_ENDPOINT` | MinIO endpoint for future adapter/status. | Optional/prepared. | `https://minio.example.com` | Server-only |
| `MINIO_ACCESS_KEY` | MinIO access key for future adapter/status. | Optional/prepared. | `minio-access-key` | Server-only |
| `MINIO_SECRET_KEY` | MinIO secret key for future adapter/status. | Optional/prepared. | `minio-secret-key` | Server-only |
| `MINIO_BUCKET` | MinIO bucket name for future adapter/status. | Optional; defaults to `sazan-media`. | `sazan-media` | Server-only |
| `NUXT_PUBLIC_SITE_URL` | Canonical public site URL used for SEO, sitemap, robots, JSON-LD. | Recommended for production. | `https://sazan.studio` | Public runtime config |
| `NUXT_PUBLIC_CONTACT_EMAIL` | Default public contact email. | Optional; defaults to `hello@sazan.studio`. | `hello@sazan.studio` | Public runtime config |
| `NUXT_PUBLIC_CONTACT_WHATSAPP` | Default public WhatsApp number/handle. | Optional. | `+31600000000` | Public runtime config |
| `NUXT_PUBLIC_CONTACT_TELEGRAM` | Default public Telegram handle or URL. | Optional. | `@sazan` | Public runtime config |
| `NUXT_PUBLIC_CONTACT_PHONE` | Default public phone. | Optional. | `+31 6 ...` | Public runtime config |
| `NUXT_PUBLIC_SOCIAL_LINKEDIN` | Default public LinkedIn URL. | Optional. | `https://www.linkedin.com/company/...` | Public runtime config |
| `NUXT_PUBLIC_SOCIAL_BEHANCE` | Default public Behance URL. | Optional. | `https://www.behance.net/...` | Public runtime config |
| `NUXT_PUBLIC_SOCIAL_DRIBBBLE` | Default public Dribbble URL. | Optional. | `https://dribbble.com/...` | Public runtime config |

Example `.env` shape:

```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=sazan

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-me
ADMIN_SESSION_SECRET=replace-with-long-random-secret
ADMIN_SESSION_MAX_AGE_SECONDS=28800

NOTIFICATION_WEBHOOK_URL=
NOTIFICATION_WEBHOOK_TOKEN=
NOTIFICATION_WEBHOOK_PROVIDER_NAME=webhook

STORAGE_PROVIDER=local
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=sazan-media

NUXT_PUBLIC_SITE_URL=https://sazan.studio
NUXT_PUBLIC_CONTACT_EMAIL=hello@sazan.studio
NUXT_PUBLIC_CONTACT_WHATSAPP=
NUXT_PUBLIC_CONTACT_TELEGRAM=
NUXT_PUBLIC_CONTACT_PHONE=
NUXT_PUBLIC_SOCIAL_LINKEDIN=
NUXT_PUBLIC_SOCIAL_BEHANCE=
NUXT_PUBLIC_SOCIAL_DRIBBBLE=
```

## 17. Security

Implemented security decisions:

- Admin credentials are read from server environment/runtime config; no credentials are hardcoded in the app.
- Admin login is verified server-side.
- Admin session cookie is HTTP-only and HMAC-signed.
- Admin session cookie is `secure` in production and `sameSite: 'lax'`.
- Every admin API endpoint calls `requireAdminSession(event)`.
- Admin page navigation is guarded by global route middleware.
- Server-side input validation exists for project requests and admin CRUD payloads.
- Text input is trimmed and control characters are removed.
- Slugs are sanitized.
- Optional URLs are restricted to safe protocols or relative paths.
- Admin media upload enforces MIME allowlist and size limit.
- Safe API errors are returned instead of raw database/secret details.
- Admin pages and admin APIs are excluded from robots and admin pages emit `noindex, nofollow, noarchive`.
- MongoDB, MinIO keys, webhook tokens, admin password, and session secret are private runtime config/server-only values.

Future developers must **not**:

- Move admin credential checks to client-only code.
- Expose private runtime config in `runtimeConfig.public`.
- Put secrets in source, docs, client bundles, or committed env files.
- Let client code connect directly to MongoDB, MinIO, or webhooks.
- Trust client-side validation alone.
- Return raw database errors or stack traces from public APIs.
- Remove admin API auth checks.
- Add destructive actions without confirmation and safe failure states.

## 18. SEO

SEO foundation is implemented through `app/composables/usePublicSeo.ts`, `app/app.vue`, public pages, and server routes.

Current SEO features:

- Global title template in `app/app.vue`: page title plus localized brand name.
- Global baseline description/OG description from homepage copy.
- Page-specific title and description on:
  - Home
  - Projects listing
  - Project detail
  - Contact
  - Start a Project
- Canonical URLs generated from `NUXT_PUBLIC_SITE_URL` and the current route path/query without hash.
- Open Graph metadata: title, description, type, site name, locale, URL, image.
- Twitter/X metadata: title, description, summary-large-image card, image.
- Default social image: `/og.svg`.
- Language alternates: `fa-IR`, `en-US`, and `x-default`.
- `robots.txt` route disallows admin/admin API and references sitemap.
- `sitemap.xml` route includes localized public routes and published local portfolio projects.
- Error page sets `noindex, nofollow`.
- Admin pages set `noindex, nofollow, noarchive` through `app/app.vue`.
- Favicon and web manifest are configured in `nuxt.config.ts`.

Implemented JSON-LD:

| Page | JSON-LD type |
| --- | --- |
| Home | `Organization` and `WebSite` |
| Projects listing | `CollectionPage` with up to 12 `CreativeWork` parts |
| Project detail | `CreativeWork` |
| Contact | `ContactPage` |
| Start a Project | `ContactPage` |

Dynamic project SEO uses the localized project selected by slug from `usePortfolio()`. Title/description come from the localized project title and short description; JSON-LD includes language, year, category, and URL.

## 19. Accessibility

Important accessibility conventions already present:

- Public layout includes a skip link to `#main-content`.
- Pages use semantic `main`, `section`, `article`, `aside`, lists, and description lists where appropriate.
- Header nav and admin nav have ARIA labels.
- Active navigation uses `aria-current`.
- Toggle/filter buttons use `aria-pressed`.
- Start Project progress uses `aria-current="step"`.
- Form fields have labels; required contact fields have validation messages and `aria-invalid`/conditional `aria-describedby`.
- Server/client error messages are shown with alert semantics where important.
- Submit button uses `aria-busy` while submitting.
- Admin mobile drawer has `role="dialog"` and `aria-modal="true"`.
- Reusable focus styling is centralized in `sazan-focus`.
- Reduced motion is respected with `@media (prefers-reduced-motion: reduce)` disabling practical animation/transition duration and smooth scrolling.
- Images/media models support localized alt text; public portfolio visuals are CSS/abstract decorative visuals, not real image content.
- External links use `target="_blank"` with `rel="noopener noreferrer"` where used.

Future work should preserve keyboard accessibility, visible focus, semantic headings, label/error associations, and RTL/LTR reading order.

## 20. API & Data Flow

### Customer Request

```text
User
→ /fa/start-a-project or /en/start-a-project
→ client-side step UI and contact validation
→ POST /api/project-requests
→ server-side option validation, email validation, sanitization
→ create ProjectRequest with status=new, notificationStatus=pending
→ createProjectRequestRecord()
   → MongoDB project_requests if MONGODB_URI exists
   → memory fallback if no MONGODB_URI
→ notifyProjectRequest()
   → webhook provider if configured
   → skipped/development-log fallback if not configured
→ update notificationStatus to sent/skipped/failed
→ return { ok: true, reference }
→ success UI
```

Persistence failure blocks the request and returns a safe `500`. Notification failure does not block a successfully persisted request.

### Admin Project

```text
Admin
→ /admin/login
→ POST /api/admin/auth/login
→ signed HTTP-only cookie
→ /admin/projects
→ GET /api/admin/projects
→ create/edit/delete or patch publish/featured state
→ protected admin API
→ parseProjectInput() validation/sanitization
→ admin data layer
   → MongoDB projects if MONGODB_URI exists
   → memory fallback if no MONGODB_URI
→ admin UI refreshes
```

Important distinction: current public portfolio pages continue to use `app/data/projects.ts`; admin/Mongo project edits are reflected in admin data, not automatically in public portfolio pages.

### Public Contact Settings

```text
Admin edits /admin/settings
→ PUT /api/admin/settings
→ validation requires public email
→ MongoDB site_settings or memory fallback
→ public Contact/Footer fetch /api/site-settings
→ public contact/social details render
```

## 21. Fallback / Development Mode

This section is important for future AI agents.

### Without MongoDB

If `MONGODB_URI` is empty:

- Public portfolio still works from `app/data/projects.ts`.
- Admin dashboard/projects/categories/services/settings still work from in-memory data seeded from local content/runtime config.
- Public Start a Project submissions are accepted and stored in process memory.
- Admin can review those in-memory requests during the same server process.
- Data is lost on process restart.

If `MONGODB_URI` is set but invalid/unreachable:

- Code attempts MongoDB and does not intentionally fall back to memory.
- APIs that require persistence can fail with safe server errors.

### Without notification provider

If `NOTIFICATION_WEBHOOK_URL` is empty:

- Project requests are still accepted as long as persistence succeeds.
- In development (`NODE_ENV !== 'production'`), a safe summary is logged.
- In production, notification is skipped without development logging.
- `notificationStatus` becomes `skipped`.

### Without MinIO

With default `STORAGE_PROVIDER=local`:

- Admin local uploads work and save under ignored `public/uploads/admin`.
- MinIO config is not needed.

With `STORAGE_PROVIDER=minio`:

- Status reports MinIO configuration state.
- Upload attempts return `501` because the MinIO upload adapter is not implemented.

## 22. Important Business Logic

- SAZAN is positioned as both premium portfolio and lead-generation platform.
- Public service/category keys are stable code/data identifiers and should be changed carefully.
- Start a Project only requires contact full name and email.
- Optional project request questions may be skipped.
- `notSure` is exclusive in the client multi-select UI for project types/features.
- Server validation is authoritative; client validation is only UX assistance.
- Project request notification failure does not invalidate a persisted request.
- Project request status defaults to `new`.
- Project request notification status starts as `pending` and becomes `sent`, `skipped`, or `failed`.
- Admin APIs require authentication, even if the corresponding admin page is hidden by route middleware.
- Admin project/category/service deletion permanently removes records from the selected data provider.
- Publish status values are `draft`, `review`, `published`, and `archived`.
- Public portfolio listing exposes only local projects with `status === 'published'`.
- Homepage selected work is based on `app/data/home.ts` `featuredProjects` entries, not dynamically derived from MongoDB.
- Related projects are selected by same category, overlapping services, and featured boost.
- Public contact/footer data can come from admin-managed site settings or runtime public contact defaults.

## 23. Coding Conventions

Practical rules for future development:

- Use TypeScript and keep strict typing working.
- Prefer existing components/composables before creating new ones.
- Use semantic design tokens and UnoCSS shortcuts.
- Avoid hardcoded colors, ad-hoc spacing, and duplicate component patterns.
- Keep all visible content bilingual (`fa` and `en`).
- Preserve native RTL/LTR behavior with logical properties/classes.
- Keep admin routes unlocalized unless explicitly redesigning admin routing.
- Do not expose secrets through `runtimeConfig.public` or client code.
- Validate and sanitize all API input server-side.
- Return safe user-facing errors from APIs.
- Preserve reduced-motion behavior.
- Preserve Mongo/memory fallback behavior unless intentionally replacing it with a documented migration.
- Keep MinIO/server storage credentials server-only.
- Do not redesign the public site or architecture unless explicitly requested.
- After meaningful changes, run at least:

```bash
npm run typecheck
npm run build
```

Run `npm audit --omit=dev` for production/security-related changes.

## 24. Common Extension Patterns

### Add a new public project

For the current public portfolio implementation:

1. Add a `PortfolioProject` entry to `app/data/projects.ts` with complete English/Persian localized fields.
2. Use an existing `category` key from `portfolioCategories` unless also adding a category/service key.
3. Provide `services`, `technologies`, `coverVisual`, `gallery`, year, `status`, `featured`, and detail content.
4. Ensure `slug` is unique.
5. Check `/fa/projects`, `/en/projects`, and both localized detail URLs.
6. If it should appear in homepage selected work, add/update `featuredProjects` in `app/data/home.ts` and matching homepage translation keys if using the homepage card data pattern.

Admin-created project records can be added through `/admin/projects`, but they do not currently feed the public portfolio pages.

### Add a new service

1. Update `ServiceKey` and `services` in `app/data/home.ts`.
2. Update service labels/descriptions in both `i18n/locales/fa.ts` and `i18n/locales/en.ts` under `home.services.items`.
3. Because `PortfolioCategoryKey = ServiceKey`, update `portfolioCategories`/portfolio translations if the service is also a public portfolio category.
4. Update project data references as needed.
5. If the new service should appear in the lead form, update `app/data/lead.ts`, `types/models.ts`, and both translation files.
6. Admin services can also be created via `/admin/services`, but public service lists currently use local `app/data/home.ts`.

### Add a new category

For public portfolio categories:

1. Update `ServiceKey`/`PortfolioCategoryKey` relationship if needed.
2. Update `portfolioCategories` and `portfolioFilters` behavior in `app/data/projects.ts`.
3. Add translations under `portfolio.categories` in both locale files.
4. Update any projects using the new category.

Admin categories can be created via `/admin/categories`; they affect admin project forms/data but do not currently change the static public filters.

### Add a new language

This is broader than adding translation keys. Update at least:

1. `nuxt.config.ts` i18n `locales` and default/fallback behavior if desired.
2. `i18n/i18n.config.ts` messages.
3. A new `i18n/locales/<code>.ts` file.
4. `types/models.ts` `LocaleCode` and every `LocalizedString` data object.
5. `useAppDirection()` for direction/language fallback.
6. `LanguageSwitcher.vue` locale code list/default behavior.
7. `usePublicSeo.ts` locale list and hreflang mapping.
8. `app/error.vue` locale/direction logic.
9. Local portfolio/home/lead data and admin localized fields.

### Add a new notification provider

1. Extend private runtime config/env variables in `nuxt.config.ts` and `.env.example` if needed.
2. Implement another `NotificationProvider` factory in `server/utils/notifications.ts`.
3. Add it to the `providers` array in `notifyProjectRequest()`.
4. Keep payloads safe; avoid sending unnecessary sensitive details.
5. Ensure provider failures return `{ ok: false }` and do not block a persisted request unless business rules change.

### Add MinIO upload support

1. Implement the `config.provider === 'minio'` branch in `server/utils/storage.ts`.
2. Use server-only `MINIO_*` environment variables.
3. Preserve MIME/size validation before upload.
4. Return a `MediaAsset` with `provider: 'minio'`, `key`, URL if appropriate, `mimeType`, and `size`.
5. Keep `/api/admin/media/status` free of secrets.
6. Update README and this document after implementation.

## 25. Current Project Status

| Area | Status | Notes |
| --- | --- | --- |
| Foundation | Implemented | Nuxt 4 app, strict TypeScript, UnoCSS, i18n, semantic tokens. |
| Homepage | Implemented | Hero, selected work, services, process, statement, CTA. |
| Portfolio listing | Implemented | Local static project data, filters, responsive cards. |
| Project details | Implemented | Local case-study pages with details, gallery, video placeholder, related projects, SEO. |
| Lead generation / Start a Project | Implemented | Multi-step bilingual flow, validation, API persistence, notifications status. |
| Contact page | Implemented | Contact directory/CTA using settings/runtime config. No contact message form endpoint. |
| Admin panel | Implemented | Dashboard, projects, categories, services, requests, settings. |
| Admin authentication | Implemented | Env credentials, signed HTTP-only cookie, route/API protection. |
| MongoDB | Partially implemented | Server-side optional persistence for admin/request/settings. Memory fallback when no URI. Public portfolio is still local static data. |
| Notifications | Partially implemented | Webhook provider and skipped/dev-log fallback. No retry queue or additional providers. |
| Media/storage | Partially implemented | Local admin uploads implemented. MinIO config/status prepared, upload adapter not implemented. |
| SEO | Implemented | Metadata, canonical, OG/Twitter, language alternates, JSON-LD, robots, sitemap, favicon/manifest. |
| Accessibility | Implemented as conventions and UI support | Semantic structure, focus states, labels/errors, reduced motion, drawer semantics. No dedicated automated accessibility test suite exists. |
| Production QA | Partially implemented | Typecheck/build/audit and runtime smoke checks were run during Phase 6. No persistent automated test script is defined in `package.json`. |
| User registration/RBAC | Not implemented | Intentionally absent. Single environment-configured admin account only. |
| Analytics/browser push | Not implemented | Intentionally absent. |
| Contact message storage flow | Not implemented | `ContactMessage` type/collection accessor exists, but no public form/API writes contact messages. |

## 26. Known Limitations

Only real limitations visible in the current codebase are listed here.

- MongoDB persistence requires valid `MONGODB_URI`; memory fallback is only used when the URI is absent, not when a configured database is unreachable.
- Memory fallback data is process-local and lost on restart.
- Public portfolio pages currently use local static data and do not dynamically read admin/Mongo project records.
- Homepage selected work is static data-driven and not derived from admin/Mongo featured projects.
- MinIO upload is not implemented; the MinIO branch returns `501`.
- Notification implementation only includes a webhook provider plus skipped/dev-log fallback; there is no retry queue.
- Contact page does not include a contact-message submission form/API.
- Admin auth is single-account env-based with no RBAC and no server-side session revocation store beyond cookie expiry/deletion.
- No `test` script or dedicated automated browser/accessibility test suite is defined in `package.json`.
- Production correctness of external services depends on deployment-provided credentials/configuration.

# Instructions for Future AI Agents

This final section is the Section 27 operational checklist for future AI agents.

1. Read `/PROJECT_CONTEXT.md` before making significant changes.
2. Inspect the existing code before introducing new architecture.
3. Preserve the Nuxt 4 architecture.
4. Preserve i18n.
5. Preserve RTL/LTR behavior.
6. Preserve light/dark themes.
7. Preserve semantic design tokens.
8. Do not duplicate existing components.
9. Do not introduce dependencies without a reason.
10. Do not expose secrets.
11. Validate server-side.
12. Run typecheck and build after meaningful changes.
13. Do not remove fallback behavior without understanding why it exists.
14. Do not redesign the public website unless explicitly requested.
15. When implementing a feature, update this document if architecture, data models, APIs, business logic, environment variables, or conventions change.

## Before You Code Checklist

```text
- Read PROJECT_CONTEXT.md
- Inspect relevant existing components
- Inspect related API/data models
- Check i18n
- Check RTL/LTR
- Check theme support
- Reuse existing components
- Implement minimally
- Run validation
- Update PROJECT_CONTEXT.md if architecture/data/API/business logic changed
```
