import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env. The Next.js app loads .env.local on its own,
// but the Prisma CLI (migrate / db push / db seed) runs outside Next, so load it here.
config({ path: ".env.local" });
config(); // fall back to .env (first value wins, so .env.local takes precedence)

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // `prisma db seed` runs this (replaces the old package.json "prisma.seed" field).
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Direct (non-pooled) connection used by `prisma migrate` / `prisma db push`.
    // Read from process.env directly (not the strict env() helper) so commands that
    // don't touch the DB — like `prisma generate` — still work before DIRECT_URL is set.
    url: process.env.DIRECT_URL,
  },
});
