// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//   // Tworzymy przykładowych użytkowników
//   await prisma.user.createMany({
//     data: [
//       { email: "admin@example.com", password: "hashedPassword", role: "admin" },
//       { email: "teacher@example.com", password: "hashedPassword", role: "teacher" },
//       { email: "student@example.com", password: "hashedPassword", role: "student" },
//     ],
//     skipDuplicates: true,
//   });
//   console.log("Seed data created");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });