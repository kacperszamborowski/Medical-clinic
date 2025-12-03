import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.createMany({
    data: [
      { email: "admin@example.com", password: "hashedPassword", role: "admin" },
      { email: "abc@example.com", password: "hashedPassword", role: "test" },
    ],
    skipDuplicates: true,
  });

}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
