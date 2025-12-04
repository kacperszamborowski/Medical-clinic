import dotenv from "dotenv";
import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

beforeAll(async () => {
  try {
    // Testowe połączenie z bazą:
    await prisma.user.findFirst();
    console.log("✅ Połączenie z bazą danych testową nawiązane");
  } catch (error) {
    console.error("❌ Błąd połączenia z bazą danych:", error);
    throw error;
  }
});

beforeEach(async () => {

});

afterAll(async () => {
  // Zamknij połączenie z bazą
  await prisma.$disconnect();
});
