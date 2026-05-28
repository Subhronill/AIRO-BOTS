/**
 * reorderNoobCapstones.ts
 *
 * Moves the four "capstone" chapters from orderIndex 13-16 to 27-30
 * so that the new deep-dive chapters (Block 5 + Block 6) can slot in
 * at positions 13-26, creating a logical learning progression:
 *
 *   1-12  : Foundations (existing Block 1-3)
 *  13-19  : Python & Statistics deep dive (Block 5)
 *  20-26  : Professional skills (Block 6)
 *  27-30  : Capstones — project, portfolio, business thinking, interview
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REORDERS = [
  { slug: 'da-noob-13-first-project',    newOrderIndex: 27 },
  { slug: 'da-noob-14-portfolio-building', newOrderIndex: 28 },
  { slug: 'da-noob-15-business-thinking',  newOrderIndex: 29 },
  { slug: 'da-noob-16-interview-prep',     newOrderIndex: 30 },
];

async function main() {
  console.log('🔄  Reordering Noob capstone chapters…\n');

  for (const { slug, newOrderIndex } of REORDERS) {
    const rows = await prisma.$queryRawUnsafe<{ id: string; title: string }[]>(
      `SELECT id, title FROM Chapter WHERE slug = ? LIMIT 1`,
      slug,
    );

    if (!rows.length) {
      console.log(`⚠️   Chapter not found: ${slug} — skipping`);
      continue;
    }

    await prisma.$executeRawUnsafe(
      `UPDATE Chapter SET orderIndex = ? WHERE slug = ?`,
      newOrderIndex,
      slug,
    );

    console.log(`✅  "${rows[0].title}" → orderIndex ${newOrderIndex}`);
  }

  console.log('\n✔   Done — capstones moved to positions 27-30.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
