import { prisma } from "./prisma";
import { hash } from "bcrypt";

async function main() {
  const passwordHash = await hash("pass123", 10);

  if (await prisma.user.count() === 0) {
    // Create users
    await prisma.user.createMany({
    data: [
      { firstname: "Jan", lastname: "Kowalski", birth_date: new Date("1985-03-25"), email: "jan.kowalski@example.com", password: passwordHash, role: "patient", verified: true, created_at: new Date() },
      { firstname: "Anna", lastname: "Nowak", birth_date: new Date("1990-07-12"), email: "anna.nowak@example.com", password: passwordHash, role: "doctor", verified: true, created_at: new Date() },
      { firstname: "Piotr", lastname: "Wiśniewski", birth_date: new Date("1978-11-02"), email: "piotr.wisniewski@example.com", password: passwordHash, role: "patient", verified: true, created_at: new Date() },
      { firstname: "Katarzyna", lastname: "Wójcik", birth_date: new Date("1992-01-15"), email: "katarzyna.wojcik@example.com", password: passwordHash, role: "patient", verified: true, created_at: new Date() },
      { firstname: "Michał", lastname: "Kamiński", birth_date: new Date("1982-06-08"), email: "michal.kaminski@example.com", password: passwordHash, role: "doctor", verified: true, created_at: new Date() },
    ],
    skipDuplicates: true,
  });
  }

  // Create doctors
  if (await prisma.doctor.count() === 0) {
    await prisma.doctor.createMany({
      data: [
      { user_id: 2, specialization: "Kardiolog", license_number: "LEK12345" },
      { user_id: 5, specialization: "Dermatolog", license_number: "LEK67890" },
    ],
      skipDuplicates: true,
    });
  }
  
  // Create schedules
  if (await prisma.schedule.count() === 0) {
    await prisma.schedule.createMany({ 
      data: [
      { doctor_id: 1, day_of_the_week: 1, hour_from: new Date("1970-01-01T09:00:00Z"), hour_to: new Date("1970-01-01T17:00:00Z") },
      { doctor_id: 1, day_of_the_week: 3, hour_from: new Date("1970-01-01T09:00:00Z"), hour_to: new Date("1970-01-01T17:00:00Z") },
      { doctor_id: 2, day_of_the_week: 2, hour_from: new Date("1970-01-01T08:00:00Z"), hour_to: new Date("1970-01-01T16:00:00Z") },
      { doctor_id: 2, day_of_the_week: 4, hour_from: new Date("1970-01-01T08:00:00Z"), hour_to: new Date("1970-01-01T16:00:00Z") },
      ], skipDuplicates: true
    });
  }
  
  // Create appointments
  if (await prisma.appointment.count() === 0) {
    await prisma.appointment.createMany({ 
      data: [
        { patient_id: 1, doctor_id: 1, date: new Date("2025-12-10"), time: new Date("1970-01-01T10:30:00Z"), status: "zaplanowana" },
        { patient_id: 3, doctor_id: 1, date: new Date("2025-12-11"), time: new Date("1970-01-01T11:30:00Z"), status: "odbyta" },
        { patient_id: 4, doctor_id: 2, date: new Date("2025-12-12"), time: new Date("1970-01-01T09:00:00Z"), status: "zaplanowana" },
      ], skipDuplicates: true 
    });
  }
  
  // Create appointments details
  if (await prisma.appointment_details.count() === 0) {

    await prisma.appointment_details.createMany({ 
      data: [
        { appointment_id: 2, diagnosis: "Nadciśnienie", recommendations: "Zdrowa dieta i regularna aktywność fizyczna", prescription: true },
      ], skipDuplicates: true 
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
