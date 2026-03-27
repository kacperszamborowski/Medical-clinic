import dotenv from "dotenv";
import { prisma } from "../db/prisma";


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
