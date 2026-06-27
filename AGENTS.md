<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Backend stack

This app was migrated off the InsForge BaaS to discrete services:

- **Database:** Postgres on [Neon](https://neon.tech) via [Prisma 7](https://www.prisma.io). The schema lives in `prisma/schema.prisma`; lookup-table seeds in `prisma/seed.ts`.
- **Auth:** [Clerk](https://clerk.com) (unchanged). Get the user with `const { userId } = await auth()` from `@clerk/nextjs/server`. Plan gating uses `has({ plan: "pro" })`.
- **File storage:** [Cloudinary](https://cloudinary.com) — see `lib/cloudinary.ts`.
- **AI:** [Anthropic Claude](https://docs.claude.com) via `@anthropic-ai/sdk` — see `lib/anthropic.ts`.
- **Background jobs:** [Inngest](https://www.inngest.com) (unchanged).
- **Credentials:** app reads keys from `.env.local` (and `.env`). Never hardcode or commit keys. See `.env.example`.

### Prisma 7 specifics (different from older Prisma you may know)

- Connection URLs are **not** in `schema.prisma`. Migrations read `DIRECT_URL` from `prisma.config.ts`; the app connects at runtime through the **pg driver adapter** on `DATABASE_URL` (pooled) in `lib/prisma.ts`.
- The client is constructed with an adapter: `new PrismaClient({ adapter })`.
- The Prisma CLI no longer auto-loads `.env`; `prisma.config.ts` loads `.env.local`/`.env` itself.
- The seed command lives in `prisma.config.ts` (`migrations.seed`), run via `pnpm db:seed`.

Key patterns:

- Import the singleton client: `import { prisma } from "@/lib/prisma"`.
- Authorization is enforced **in app code** (every query filters by `user_id: userId`) — there is no row-level security now that Postgres RLS / Clerk-JWT integration is gone. Keep the `user_id` filter on every read and write.
- For storage uploads, persist both the returned `url` and `key` (Cloudinary `public_id`).
<!-- BACKEND:END -->
