# Tourism Consultancy Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual, CMS-managed tourism consultancy website that stores qualified consultation requests and sends email notifications.

**Architecture:** Use a Next.js modular monolith organized by feature with presentation, application, domain, and infrastructure boundaries. Sanity owns public content; PostgreSQL owns consultation requests; application use cases depend on interfaces rather than Prisma, Sanity, Resend, or Turnstile implementations.

**Tech Stack:** Next.js, TypeScript, React, Tailwind CSS, Sanity, PostgreSQL, Prisma, next-intl, Zod, Resend, Cloudflare Turnstile, Vercel

**Spec:** `docs/superpowers/specs/2026-08-29-tourism-consultancy-platform-design.md`

## Global Constraints

- Read `AGENTS.md` and `learnt.md` before every task.
- Query Graphify before broad source inspection; update the graph after architectural changes.
- Do not write test cases.
- Verify changes with TypeScript, lint, production build, and focused browser checks as applicable.
- The application must support Turkish and English under `/tr` and `/en`.
- Use `Mihenk` only as a temporary CMS-managed brand name.
- Keep personal data in PostgreSQL, never in Sanity or application logs.
- Keep WhatsApp, customer accounts, request management, file uploads, Blog/Rehber, videos, documents, exams, and certificates out of the first phase.
- Keep domain and application modules independent of Prisma, Sanity, Resend, and Turnstile.

---

## Planned File Structure

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── about/page.tsx
│   │   ├── consultation/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── equipment/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── sectors/[slug]/page.tsx
│   │   ├── services/[slug]/page.tsx
│   │   ├── trainings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/consultations/route.ts
│   ├── studio/[[...tool]]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/site-footer.tsx
│   ├── layout/site-header.tsx
│   ├── sections/cta-section.tsx
│   └── ui/
├── i18n/
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
├── modules/consultation/
│   ├── application/create-consultation-request.ts
│   ├── domain/consultation-request.ts
│   ├── domain/consultation-request-repository.ts
│   ├── domain/notification-service.ts
│   ├── infrastructure/prisma-consultation-request-repository.ts
│   ├── infrastructure/resend-notification-service.ts
│   ├── infrastructure/turnstile-verifier.ts
│   └── presentation/consultation-form.tsx
├── sanity/
│   ├── client.ts
│   ├── env.ts
│   ├── queries.ts
│   ├── schemas/
│   └── structure.ts
└── shared/
    ├── db/prisma.ts
    ├── env/server.ts
    ├── rate-limit/rate-limiter.ts
    └── result/result.ts
messages/
├── en.json
└── tr.json
prisma/
└── schema.prisma
sanity.config.ts
sanity.cli.ts
```

---

### Task 1: Repository and Next.js Foundation

**Files:**
- Create: `.gitignore`
- Create: `.env.example`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Modify: `learnt.md`

**Interfaces:**
- Produces: a runnable Next.js TypeScript application and standard scripts `dev`, `build`, `lint`, `typecheck`, `format`.
- Produces: environment variable names consumed by later tasks.

- [ ] **Step 1: Initialize source control and scaffold the application**

Run:

```powershell
git init
pnpm create next-app@latest scaffold-app --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install --disable-git
Get-ChildItem -LiteralPath '.\scaffold-app' -Force | Where-Object Name -Ne '.gitignore' | Copy-Item -Destination '.' -Recurse -Force
Copy-Item -LiteralPath '.\scaffold-app\.gitignore' -Destination '.\.gitignore.next'
```

Merge the generated `.gitignore.next` entries into the root `.gitignore`, verify that the resolved scaffold path is exactly `<project-root>\scaffold-app`, then remove only that scaffold directory. Preserve `AGENTS.md`, `learnt.md`, `.tools/`, `.superpowers/`, and `docs/`.

- [ ] **Step 2: Install shared dependencies**

Run:

```powershell
pnpm add next-intl zod @prisma/client resend @marsidev/react-turnstile
pnpm add -D prisma prettier prettier-plugin-tailwindcss
```

- [ ] **Step 3: Define scripts and environment contract**

Ensure `package.json` exposes:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "graphify": ".tools/graphify/Scripts/graphify.exe .",
    "graphify:update": ".tools/graphify/Scripts/graphify.exe . --update"
  }
}
```

Create `.env.example` containing names only:

```dotenv
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2026-08-29
SANITY_API_READ_TOKEN=
RESEND_API_KEY=
CONSULTATION_FROM_EMAIL=
CONSULTATION_NOTIFICATION_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

- [ ] **Step 4: Exclude generated and local-only files**

Add these entries to `.gitignore`:

```gitignore
.env*
!.env.example
.next/
node_modules/
.tools/
.superpowers/
graphify-out/
```

- [ ] **Step 5: Establish the temporary root page and global style tokens**

Use CSS custom properties for the approved dark green, warm gold, cream, text, surface, border, focus, and error roles. Keep the root page minimal and replace it in Task 5.

- [ ] **Step 6: Verify the foundation**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Expected: all commands exit with code 0.

- [ ] **Step 7: Build the first Graphify map**

Run:

```powershell
pnpm graphify
```

Expected: `graphify-out/graph.json`, `graphify-out/graph.html`, and `graphify-out/GRAPH_REPORT.md` exist.

- [ ] **Step 8: Record and commit the foundation**

Update `learnt.md` with package manager, generated Next.js version, and important scaffold deviations.

```powershell
git add .
git commit -m "chore: initialize consultancy platform"
```

---

### Task 2: Localization and Shared Site Shell

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/middleware.ts`
- Create: `messages/tr.json`
- Create: `messages/en.json`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/components/layout/language-switcher.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `routing.locales` as `['tr', 'en']` with `tr` as default.
- Produces: locale-aware `Link`, `redirect`, `usePathname`, and `useRouter` from `src/i18n/navigation.ts`.
- Produces: shared layout props `{ children: React.ReactNode; params: Promise<{ locale: string }> }`.

- [ ] **Step 1: Configure locale routing**

Define:

```ts
export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'always',
});
```

Configure `next-intl` in `next.config.ts` and request message loading in `src/i18n/request.ts`.

- [ ] **Step 2: Add Turkish and English interface copy**

Both message files must define identical keys for navigation, shared calls to action, form labels, validation messages, success messages, footer labels, and language names.

- [ ] **Step 3: Build the accessible header and footer**

Header navigation must include home, services, sectors, trainings, equipment, projects, about, and contact. It must not include Blog/Rehber.

- [ ] **Step 4: Add locale metadata and invalid-locale handling**

Call `notFound()` for unsupported locales and set the document language using the active locale.

- [ ] **Step 5: Verify localization**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Manually open `/tr` and `/en`; confirm navigation, language switching, keyboard focus, and no missing-message errors.

- [ ] **Step 6: Update Graphify and commit**

```powershell
pnpm graphify:update
git add src messages next.config.ts
git commit -m "feat: add bilingual site shell"
```

---

### Task 3: Sanity Studio and Content Schemas

**Files:**
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Create: `src/sanity/env.ts`
- Create: `src/sanity/client.ts`
- Create: `src/sanity/queries.ts`
- Create: `src/sanity/structure.ts`
- Create: `src/sanity/schemas/index.ts`
- Create: `src/sanity/schemas/objects/localized-string.ts`
- Create: `src/sanity/schemas/objects/localized-text.ts`
- Create: `src/sanity/schemas/objects/seo.ts`
- Create: `src/sanity/schemas/documents/site-settings.ts`
- Create: `src/sanity/schemas/documents/home-page.ts`
- Create: `src/sanity/schemas/documents/service.ts`
- Create: `src/sanity/schemas/documents/sector.ts`
- Create: `src/sanity/schemas/documents/training.ts`
- Create: `src/sanity/schemas/documents/equipment-category.ts`
- Create: `src/sanity/schemas/documents/project.ts`
- Create: `src/sanity/schemas/documents/about-page.ts`
- Create: `src/sanity/schemas/documents/contact-page.ts`
- Create: `src/sanity/schemas/documents/legal-page.ts`

**Interfaces:**
- Produces: `LocalizedString = { tr?: string; en?: string }`.
- Produces: `LocalizedText` for Portable Text values keyed by locale.
- Produces: GROQ functions `getSiteSettings(locale)`, `getHomePage(locale)`, `getServices(locale)`, `getServiceBySlug(locale, slug)`, `getSectors(locale)`, `getSectorBySlug(locale, slug)`, `getTrainings(locale)`, `getEquipmentCategories(locale)`, `getProjects(locale)`, `getAboutPage(locale)`, `getContactPage(locale)`, and `getLegalPage(locale, slug)`.

- [ ] **Step 1: Install and configure Sanity**

Run:

```powershell
pnpm add sanity next-sanity @sanity/vision @portabletext/react
```

Mount Sanity Studio at `/studio` and keep all write credentials server-only.

- [ ] **Step 2: Define reusable localization and SEO objects**

Use field-level localization:

```ts
export type LocalizedString = {
  tr?: string;
  en?: string;
};
```

Add validation requiring at least one language. Page queries must return `null` for a locale when required localized fields are absent.

- [ ] **Step 3: Define content documents**

Every public document must include localized title, localized slug where appropriate, localized summary/body, image alternative text, ordering, publication state, and localized SEO fields.

Do not create a blog schema.

- [ ] **Step 4: Define editor navigation**

Group Studio items as Site, Services, Sectors, Trainings, Equipment, Projects, Company, and Legal.

- [ ] **Step 5: Add typed query boundaries**

Keep GROQ strings in `src/sanity/queries.ts`; UI components must not embed GROQ.

- [ ] **Step 6: Verify Studio and content queries**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Manually open `/studio`, authenticate, create one bilingual sample service, and verify draft/published behavior.

- [ ] **Step 7: Update Graphify and commit**

```powershell
pnpm graphify:update
git add sanity.config.ts sanity.cli.ts src/sanity src/app/studio
git commit -m "feat: add localized Sanity content model"
```

---

### Task 4: Shared Visual System and Content Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/container.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/components/ui/rich-text.tsx`
- Create: `src/components/ui/responsive-image.tsx`
- Create: `src/components/sections/hero-section.tsx`
- Create: `src/components/sections/card-grid.tsx`
- Create: `src/components/sections/process-section.tsx`
- Create: `src/components/sections/cta-section.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `Button` supporting link and button use with `primary`, `secondary`, and `text` variants.
- Produces: content components that accept plain typed props rather than Sanity client instances.

- [ ] **Step 1: Implement approved brand tokens**

Define semantic tokens for dark green, warm gold, cream, surface, text, muted text, border, focus, success, and error. Meet readable contrast and visible focus requirements.

- [ ] **Step 2: Build focused primitives**

Each file owns one visual responsibility. Do not create a generic component with unrelated variants.

- [ ] **Step 3: Build content sections**

Sections must support CMS content, responsive layout, keyboard navigation, image alternative text, and optional calls to action.

- [ ] **Step 4: Verify responsive behavior**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Manually inspect at approximately 360px, 768px, and 1440px widths.

- [ ] **Step 5: Update Graphify and commit**

```powershell
pnpm graphify:update
git add src/components src/app/globals.css
git commit -m "feat: add Mihenk visual system"
```

---

### Task 5: CMS-Driven Public Pages

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/services/[slug]/page.tsx`
- Create: `src/app/[locale]/sectors/[slug]/page.tsx`
- Create: `src/app/[locale]/trainings/page.tsx`
- Create: `src/app/[locale]/equipment/page.tsx`
- Create: `src/app/[locale]/projects/page.tsx`
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/components/sections/service-list.tsx`
- Create: `src/components/sections/sector-list.tsx`
- Create: `src/components/sections/training-list.tsx`
- Create: `src/components/sections/equipment-list.tsx`
- Create: `src/components/sections/project-list.tsx`

**Interfaces:**
- Consumes: query functions from Task 3 and visual components from Task 4.
- Produces: statically renderable, locale-aware public pages with `generateMetadata` and `generateStaticParams` where appropriate.

- [ ] **Step 1: Implement the home page composition**

Render hero, new-investment/current-business paths, services, sectors, process, selected projects, and consultation call to action from Sanity data.

- [ ] **Step 2: Implement service and sector detail routes**

Return `notFound()` when the requested locale content or localized slug is absent.

- [ ] **Step 3: Implement list and company pages**

Training pages must describe face-to-face delivery only. Equipment pages must present planning categories and must not behave as a store.

- [ ] **Step 4: Add empty and unpublished states**

Public pages must hide incomplete locale content without falling back to the other language.

- [ ] **Step 5: Verify public pages**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Manually verify every navigation destination in Turkish and English, including 404 behavior.

- [ ] **Step 6: Update Graphify and commit**

```powershell
pnpm graphify:update
git add src/app src/components/sections
git commit -m "feat: add CMS driven public pages"
```

---

### Task 6: Consultation Domain and Database

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/shared/db/prisma.ts`
- Create: `src/shared/result/result.ts`
- Create: `src/modules/consultation/domain/consultation-request.ts`
- Create: `src/modules/consultation/domain/consultation-request-repository.ts`
- Create: `src/modules/consultation/domain/notification-service.ts`
- Create: `src/modules/consultation/application/create-consultation-request.ts`
- Create: `src/modules/consultation/infrastructure/prisma-consultation-request-repository.ts`

**Interfaces:**
- Produces: `ConsultationRequestInput`, `ConsultationRequest`, `ConsultationRequestRepository`, `NotificationService`, and `createConsultationRequest`.

Define the domain input:

```ts
export type ConsultationRequestInput = {
  locale: 'tr' | 'en';
  applicantType: 'NEW_INVESTMENT' | 'EXISTING_BUSINESS';
  businessType: 'HOTEL' | 'RESTAURANT' | 'CAFE' | 'WEDDING_HALL' | 'EVENT_HALL';
  serviceTypes: Array<'TURNKEY_SETUP' | 'OPERATIONS' | 'EQUIPMENT' | 'FACE_TO_FACE_TRAINING' | 'RENOVATION'>;
  city: string;
  currentState: string;
  capacityOrArea?: string;
  targetDate?: string;
  budgetRange?: string;
  description: string;
  fullName: string;
  companyName?: string;
  phone: string;
  email: string;
  preferredContact: 'PHONE' | 'EMAIL';
  kvkkAccepted: true;
};
```

Repository contract:

```ts
export interface ConsultationRequestRepository {
  create(input: ConsultationRequestInput & { referenceNumber: string }): Promise<ConsultationRequest>;
  markNotificationFailed(id: string, reasonCode: string): Promise<void>;
}
```

- [ ] **Step 1: Define the Prisma model**

Persist all form values, reference number, notification status, locale, creation time, and update time. Add unique indexing for reference number and indexes for creation time, applicant type, and business type.

- [ ] **Step 2: Generate Prisma client and migration**

Run:

```powershell
pnpm prisma generate
pnpm prisma migrate dev --name create_consultation_requests
```

- [ ] **Step 3: Implement domain types and ports**

Keep domain files free of Prisma imports.

- [ ] **Step 4: Implement the use case**

`createConsultationRequest` must generate a non-guessable public reference number, persist first, notify second, mark notification failure without deleting the request, and return the saved request.

- [ ] **Step 5: Implement the Prisma adapter**

Map domain enums explicitly to Prisma values. Never pass arbitrary request objects directly to Prisma.

- [ ] **Step 6: Verify database integration**

Run:

```powershell
pnpm prisma validate
pnpm typecheck
pnpm lint
pnpm build
```

- [ ] **Step 7: Update Graphify and commit**

```powershell
pnpm graphify:update
git add prisma src/modules/consultation src/shared/db src/shared/result
git commit -m "feat: add consultation request domain"
```

---

### Task 7: Email, Turnstile, Rate Limiting, and API Boundary

**Files:**
- Create: `src/shared/env/server.ts`
- Create: `src/shared/rate-limit/rate-limiter.ts`
- Create: `src/modules/consultation/infrastructure/resend-notification-service.ts`
- Create: `src/modules/consultation/infrastructure/turnstile-verifier.ts`
- Create: `src/modules/consultation/presentation/consultation-schema.ts`
- Create: `src/app/api/consultations/route.ts`

**Interfaces:**
- Consumes: `createConsultationRequest` and domain ports from Task 6.
- Produces: `POST /api/consultations`.
- Success response: `{ ok: true, referenceNumber: string }` with HTTP 201.
- Validation response: `{ ok: false, code: 'VALIDATION_ERROR', fields: Record<string, string> }` with HTTP 400.
- Spam response: `{ ok: false, code: 'VERIFICATION_FAILED' }` with HTTP 400 or 429.
- Server response: `{ ok: false, code: 'REQUEST_FAILED' }` with HTTP 500.

- [ ] **Step 1: Validate server environment**

Use a Zod server schema. Do not expose Resend, database, Turnstile secret, or Sanity read token to client bundles.

- [ ] **Step 2: Implement the localized form schema**

Validate enum values, lengths, normalized email, normalized phone, required description, at least one service type, and literal `true` for KVKK acceptance.

- [ ] **Step 3: Implement Turnstile verification**

Send the token and request IP to Cloudflare's verification endpoint. Return a boolean/result object without leaking the Cloudflare response to the browser.

- [ ] **Step 4: Implement rate limiting**

Rate limit by a privacy-conscious hash of IP plus normalized email. Return HTTP 429 when exceeded. Keep the limiter behind an interface so a durable provider can replace the initial implementation.

- [ ] **Step 5: Implement localized email notifications**

Send one internal email with request details and one Turkish or English confirmation email containing the reference number. Do not log email bodies or personal data.

- [ ] **Step 6: Implement the API route**

Order operations as: parse JSON, rate limit, validate schema, verify Turnstile, call use case, map result to safe HTTP response.

- [ ] **Step 7: Verify the boundary**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Use a local HTTP request to verify malformed payloads return 400 without database writes. Use configured development credentials to verify one successful request and confirmation email.

- [ ] **Step 8: Update Graphify and commit**

```powershell
pnpm graphify:update
git add src/app/api src/modules/consultation src/shared
git commit -m "feat: add secure consultation API"
```

---

### Task 8: Two-Step Consultation Form

**Files:**
- Create: `src/app/[locale]/consultation/page.tsx`
- Create: `src/modules/consultation/presentation/consultation-form.tsx`
- Create: `src/modules/consultation/presentation/project-step.tsx`
- Create: `src/modules/consultation/presentation/contact-step.tsx`
- Create: `src/modules/consultation/presentation/form-success.tsx`
- Create: `src/modules/consultation/presentation/use-consultation-form.ts`
- Modify: `messages/tr.json`
- Modify: `messages/en.json`

**Interfaces:**
- Consumes: `POST /api/consultations` from Task 7.
- Produces: a two-step form with draft state local to the page and final reference-number success state.

- [ ] **Step 1: Implement form state and step rules**

Step 1 contains project fields. Step 2 contains contact fields, Turnstile, and KVKK. Users may return to Step 1 without losing values.

- [ ] **Step 2: Implement project fields**

Change visible fields based on new investment/current business selection without silently deleting already entered values.

- [ ] **Step 3: Implement contact and consent fields**

Use visible labels, clear required indicators, inline validation, error summary, and links to the active-locale KVKK text.

- [ ] **Step 4: Implement submission states**

Prevent duplicate submission while pending. On success, replace the form with the reference number. On failure, retain values and show a safe localized error.

- [ ] **Step 5: Verify the full user flow**

Run:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Manually verify Turkish and English flows, keyboard-only operation, validation errors, back navigation, duplicate-click prevention, success state, and server-failure state.

- [ ] **Step 6: Update Graphify and commit**

```powershell
pnpm graphify:update
git add src/app/[locale]/consultation src/modules/consultation/presentation messages
git commit -m "feat: add two-step consultation form"
```

---

### Task 9: SEO, Legal Pages, and Production Readiness

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/[locale]/legal/[slug]/page.tsx`
- Create: `src/app/[locale]/error.tsx`
- Create: `src/app/[locale]/loading.tsx`
- Create: `src/shared/seo/build-metadata.ts`
- Modify: all public page files requiring metadata
- Modify: `README.md`

**Interfaces:**
- Produces: canonical URLs, `hreflang` alternatives, localized metadata, sitemap entries, robots rules, and safe route-level error UI.

- [ ] **Step 1: Implement localized metadata**

Build page metadata from Sanity SEO fields and site settings. Do not use content from the opposite locale as fallback.

- [ ] **Step 2: Implement sitemap and robots**

Include published Turkish and English pages only. Exclude `/studio`, API routes, preview routes, and unpublished content.

- [ ] **Step 3: Implement legal and error states**

Render localized KVKK and privacy pages from Sanity. Error UI must not disclose internal identifiers, stack traces, or database messages.

- [ ] **Step 4: Document local setup**

README must document prerequisites, environment variables, Sanity setup, PostgreSQL migration, Resend sender verification, Turnstile keys, development commands, build command, and Graphify update commands.

- [ ] **Step 5: Perform final verification**

Run:

```powershell
pnpm prisma validate
pnpm typecheck
pnpm lint
pnpm build
```

Manually verify all routes in both locales, responsive layouts, keyboard navigation, CMS publishing, consultation persistence, emails, Turnstile, 404, error UI, metadata, sitemap, and robots output.

- [ ] **Step 6: Rebuild Graphify and inspect architecture**

Run:

```powershell
pnpm graphify
```

Use Graphify queries to confirm the consultation presentation layer reaches Prisma and Resend only through application/domain interfaces. Record relevant findings in `learnt.md`.

- [ ] **Step 7: Commit production readiness**

```powershell
git add .
git commit -m "feat: complete consultancy platform first phase"
```
