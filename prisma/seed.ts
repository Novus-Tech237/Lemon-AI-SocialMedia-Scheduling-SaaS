// Seeds the two lookup tables that the SQL file pre-populated.
// Run with `pnpm db:seed`.
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// The CLI loads env via prisma.config.ts, but this script also runs standalone
// (e.g. `tsx prisma/seed.ts`), so load .env.local/.env here too. Prisma 7 connects
// through a driver adapter, so construct the client with one.
config({ path: ".env.local" });
config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const channelTypes = [
  { type: "TWITTER", name: "Twitter / X", color: "#000000", character_limit: 280 },
  { type: "LINKEDIN", name: "LinkedIn", color: "#2867b2", character_limit: 3000 },
  { type: "INSTAGRAM", name: "Instagram", color: "#E4405F", character_limit: 2200 },
  { type: "THREADS", name: "Threads", color: "#000000", character_limit: 500 },
  { type: "FACEBOOK", name: "Facebook", color: "#1877F2", character_limit: 63206 },
  { type: "BLUESKY", name: "Bluesky", color: "#1285fe", character_limit: 300 },
  { type: "YOUTUBE", name: "YouTube", color: "#FF0000", character_limit: 100 },
  { type: "TIKTOK", name: "Tiktok", color: "#000000", character_limit: 100 },
];

const ideaGroups = ["Unassigned", "To Do", "In Progress", "Done"];

const sampleIdeas: { title: string; description: string; group: string }[] = [
  // Unassigned — raw brainstorm
  {
    title: "Behind-the-scenes day in my life",
    description: "Show the real process: planning content, editing, dealing with writer's block. Authentic over polished.",
    group: "Unassigned",
  },
  {
    title: "Hot take: consistency beats creativity",
    description: "Argument that showing up daily with average content outperforms posting a masterpiece once a month.",
    group: "Unassigned",
  },
  {
    title: "Tool stack thread",
    description: "Everything I use to plan, write, and schedule posts. Affiliate links potential.",
    group: "Unassigned",
  },

  // To Do — planned and ready to write
  {
    title: "5 mistakes I made growing from 0 to 10k followers",
    description: "Vulnerability post. Cover chasing vanity metrics, ignoring DMs, and posting without a niche.",
    group: "To Do",
  },
  {
    title: "How to repurpose one idea into 7 posts",
    description: "Tutorial carousel: take a single insight and spin it into a thread, a short, a story, a carousel, a blog, an email, and a quote graphic.",
    group: "To Do",
  },
  {
    title: "Comparison: scheduling manually vs using AI",
    description: "Before/after format. Time saved, consistency improvement, engagement delta.",
    group: "To Do",
  },

  // In Progress — being drafted or designed
  {
    title: "LinkedIn carousel: how to write a hook",
    description: "10-slide carousel breaking down the anatomy of a scroll-stopping first line. Draft 80% done.",
    group: "In Progress",
  },
  {
    title: "Twitter/X thread: content calendar for beginners",
    description: "Step-by-step thread. Intro tweet done, working on slides 4–8.",
    group: "In Progress",
  },

  // Done — published or archived
  {
    title: "Why I batch-create content on Sundays",
    description: "Posted on LinkedIn. 3.2k impressions, 47 reposts. Reuse angle for Instagram Reel.",
    group: "Done",
  },
  {
    title: "The 3-sentence post formula",
    description: "Hook. Value. CTA. Published as a Twitter thread and Instagram carousel. Strong saves.",
    group: "Done",
  },
];

async function main() {
  const channels = await prisma.channel_types.createMany({
    data: channelTypes,
    skipDuplicates: true,
  });

  const groups = await prisma.idea_groups.createMany({
    data: ideaGroups.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log(
    `Seeded channel_types (+${channels.count}) and idea_groups (+${groups.count}).`,
  );

  const seedUserId = process.env.SEED_USER_ID;
  if (!seedUserId) {
    console.log("Skipping sample ideas — set SEED_USER_ID in .env.local to seed them.");
    return;
  }

  const allGroups = await prisma.idea_groups.findMany();
  const groupMap = Object.fromEntries(allGroups.map((g) => [g.name, g.id]));

  const ideas = await prisma.ideas.createMany({
    data: sampleIdeas.map((idea, i) => ({
      user_id: seedUserId,
      group_id: groupMap[idea.group],
      title: idea.title,
      description: idea.description,
      sort_order: i,
    })),
    skipDuplicates: true,
  });

  console.log(`Seeded ${ideas.count} sample ideas for user ${seedUserId}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
