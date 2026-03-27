import { prisma } from "../db/prisma";
import { seed } from "./seed";

export async function resetDB() {
  const tables = await prisma.$queryRawUnsafe<
    { tablename: string }[]
  >(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `);

  const tableNames = tables.map(t => `"${t.tablename}"`).join(", ");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;
  `);

  await seed();

  console.log("DB reset + seed done");
}

resetDB()
  .catch(console.error)
  .finally(() => prisma.$disconnect());