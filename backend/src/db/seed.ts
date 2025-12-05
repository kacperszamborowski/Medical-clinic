import { prisma } from "./prisma";
import { hash } from "bcrypt";

async function main() {
  const passwordHash = await hash("!Test123", 10);

  await prisma.user.createMany({
    data: [
      { email: "admin@example.com", password: passwordHash, role: "admin" },
      { email: "patient@example.com", password: passwordHash, role: "patient" },
    ],
    skipDuplicates: true,
  });
  
  await prisma.patient.createMany({
    data: [
      { firstname: 'Anna', lastname: 'Kowalska', birth_date: new Date('1990-01-10'), phone: '501000001', email: 'anna.kowalska@example.com', registration_date: new Date('2024-01-10') },
      { firstname: 'Jan', lastname: 'Nowak', birth_date: new Date('1985-03-22'), phone: '501000002', email: 'jan.nowak@example.com', registration_date: new Date('2024-01-11') },
      { firstname: 'Maria', lastname: 'Wiśniewska', birth_date: new Date('1992-07-14'), phone: '501000003', email: 'maria.wisniewska@example.com', registration_date: new Date('2024-01-12') },
      { firstname: 'Krzysztof', lastname: 'Wójcik', birth_date: new Date('1988-11-02'), phone: '501000004', email: 'krzysztof.wojcik@example.com', registration_date: new Date('2024-01-13') },
      { firstname: 'Agnieszka', lastname: 'Kowalczyk', birth_date: new Date('1985-05-30'), phone: '501000005', email: 'agnieszka.kowalczyk@example.com', registration_date: new Date('2024-01-14') },
      { firstname: 'Piotr', lastname: 'Kamiński', birth_date: new Date('1993-09-20'), phone: '501000006', email: 'piotr.kaminski@example.com', registration_date: new Date('2024-01-15') },
      { firstname: 'Magdalena', lastname: 'Lewandowska', birth_date: new Date('1991-02-18'), phone: '501000007', email: 'magdalena.lewandowska@example.com', registration_date: new Date('2024-01-16') },
      { firstname: 'Adam', lastname: 'Zieliński', birth_date: new Date('1994-12-05'), phone: '501000008', email: 'adam.zielinski@example.com', registration_date: new Date('2024-01-17') },
      { firstname: 'Ewa', lastname: 'Szymańska', birth_date: new Date('1989-04-09'), phone: '501000009', email: 'ewa.szymanska@example.com', registration_date: new Date('2024-01-18') },
      { firstname: 'Tomasz', lastname: 'Woźniak', birth_date: new Date('1985-08-23'), phone: '501000010', email: 'tomasz.wozniak@example.com', registration_date: new Date('2024-01-19') },
      { firstname: 'Karolina', lastname: 'Dąbrowska', birth_date: new Date('1992-06-10'), phone: '501000011', email: 'karolina.dabrowska@example.com', registration_date: new Date('2024-01-20') },
      { firstname: 'Paweł', lastname: 'Kozłowski', birth_date: new Date('1987-10-04'), phone: '501000012', email: 'pawel.kozlowski@example.com', registration_date: new Date('2024-01-21') },
      { firstname: 'Joanna', lastname: 'Jankowska', birth_date: new Date('1990-03-11'), phone: '501000013', email: 'joanna.jankowska@example.com', registration_date: new Date('2024-01-22') },
      { firstname: 'Marek', lastname: 'Mazur', birth_date: new Date('1988-12-16'), phone: '501000014', email: 'marek.mazur@example.com', registration_date: new Date('2024-01-23') },
      { firstname: 'Julia', lastname: 'Wojciechowska', birth_date: new Date('1993-09-02'), phone: '501000015', email: 'julia.wojciechowska@example.com', registration_date: new Date('2024-01-24') },
      { firstname: 'Łukasz', lastname: 'Kwiatkowski', birth_date: new Date('1989-05-27'), phone: '501000016', email: 'lukasz.kwiatkowski@example.com', registration_date: new Date('2024-01-25') },
      { firstname: 'Natalia', lastname: 'Krawczyk', birth_date: new Date('1995-07-19'), phone: '501000017', email: 'natalia.krawczyk@example.com', registration_date: new Date('2024-01-26') },
      { firstname: 'Dawid', lastname: 'Kaczmarek', birth_date: new Date('1987-02-14'), phone: '501000018', email: 'dawid.kaczmarek@example.com', registration_date: new Date('2024-01-27') },
      { firstname: 'Weronika', lastname: 'Piotrowska', birth_date: new Date('1994-11-08'), phone: '501000019', email: 'weronika.piotrowska@example.com', registration_date: new Date('2024-01-28') },
      { firstname: 'Michał', lastname: 'Grabowski', birth_date: new Date('1993-01-29'), phone: '501000020', email: 'michal.grabowski@example.com', registration_date: new Date('2024-01-29') },
    ],
    skipDuplicates: true,
  });
  
  await prisma.doctor.createMany({
    data: [
      { firstname: 'Piotr', lastname: 'Wiśniewski', specialization: 'Kardiolog', license_number: 'LIC001' },
      { firstname: 'Ewa', lastname: 'Lewandowska', specialization: 'Dermatolog', license_number: 'LIC002' },
      { firstname: 'Adam', lastname: 'Kamiński', specialization: 'Internista', license_number: 'LIC003' },
      { firstname: 'Anna', lastname: 'Kubiak', specialization: 'Ortopeda', license_number: 'LIC004' },
      { firstname: 'Marek', lastname: 'Zawadzki', specialization: 'Neurolog', license_number: 'LIC005' },
      { firstname: 'Karolina', lastname: 'Grzelak', specialization: 'Pediatra', license_number: 'LIC006' },
      { firstname: 'Paweł', lastname: 'Baran', specialization: 'Laryngolog', license_number: 'LIC007' },
      { firstname: 'Justyna', lastname: 'Lis', specialization: 'Okulista', license_number: 'LIC008' },
      { firstname: 'Tomasz', lastname: 'Kos', specialization: 'Chirurg', license_number: 'LIC009' },
      { firstname: 'Monika', lastname: 'Kaczor', specialization: 'Endokrynolog', license_number: 'LIC010' },
    ],
    skipDuplicates: true,
  });
  
  await prisma.schedule.createMany({
    data: [
      { doctor_id: 1, day_of_the_week: 1, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T14:00:00Z' },
      { doctor_id: 1, day_of_the_week: 3, hour_from: '1970-01-01T10:00:00Z', hour_to: '1970-01-01T18:00:00Z' },
      { doctor_id: 2, day_of_the_week: 2, hour_from: '1970-01-01T09:00:00Z', hour_to: '1970-01-01T15:00:00Z' },
      { doctor_id: 2, day_of_the_week: 4, hour_from: '1970-01-01T12:00:00Z', hour_to: '1970-01-01T18:00:00Z' },
      { doctor_id: 3, day_of_the_week: 1, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T16:00:00Z' },
      { doctor_id: 3, day_of_the_week: 5, hour_from: '1970-01-01T09:00:00Z', hour_to: '1970-01-01T13:00:00Z' },
      { doctor_id: 4, day_of_the_week: 2, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T14:00:00Z' },
      { doctor_id: 4, day_of_the_week: 4, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T16:00:00Z' },
      { doctor_id: 5, day_of_the_week: 3, hour_from: '1970-01-01T10:00:00Z', hour_to: '1970-01-01T18:00:00Z' },
      { doctor_id: 5, day_of_the_week: 5, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T12:00:00Z' },
      { doctor_id: 6, day_of_the_week: 1, hour_from: '1970-01-01T09:00:00Z', hour_to: '1970-01-01T17:00:00Z' },
      { doctor_id: 6, day_of_the_week: 3, hour_from: '1970-01-01T09:00:00Z', hour_to: '1970-01-01T15:00:00Z' },
      { doctor_id: 7, day_of_the_week: 2, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T16:00:00Z' },
      { doctor_id: 7, day_of_the_week: 4, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T14:00:00Z' },
      { doctor_id: 8, day_of_the_week: 1, hour_from: '1970-01-01T11:00:00Z', hour_to: '1970-01-01T17:00:00Z' },
      { doctor_id: 8, day_of_the_week: 5, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T12:00:00Z' },
      { doctor_id: 9, day_of_the_week: 2, hour_from: '1970-01-01T10:00:00Z', hour_to: '1970-01-01T18:00:00Z' },
      { doctor_id: 9, day_of_the_week: 3, hour_from: '1970-01-01T08:00:00Z', hour_to: '1970-01-01T16:00:00Z' },
      { doctor_id: 10, day_of_the_week: 4, hour_from: '1970-01-01T09:00:00Z', hour_to: '1970-01-01T17:00:00Z' },
      { doctor_id: 10, day_of_the_week: 5, hour_from: '1970-01-01T09:00:00Z', hour_to: '1970-01-01T13:00:00Z' },
    ],
    skipDuplicates: true,
  });
  
  await prisma.appointment.createMany({
    data: [
      { patient_id: 1, doctor_id: 1, date: new Date('2024-03-01'), time: '1970-01-01T09:00:00Z', status: 'zarezerwowana' },
      { patient_id: 2, doctor_id: 1, date: new Date('2024-03-01'), time: '1970-01-01T10:00:00Z', status: 'zrealizowana' },
      { patient_id: 3, doctor_id: 2, date: new Date('2024-03-02'), time: '1970-01-01T12:30:00Z', status: 'zarezerwowana' },
      { patient_id: 4, doctor_id: 3, date: new Date('2024-03-04'), time: '1970-01-01T11:15:00Z', status: 'anulowana' },
      { patient_id: 5, doctor_id: 4, date: new Date('2024-03-04'), time: '1970-01-01T13:45:00Z', status: 'zarezerwowana' },
      { patient_id: 6, doctor_id: 5, date: new Date('2024-03-05'), time: '1970-01-01T10:00:00Z', status: 'zrealizowana' },
      { patient_id: 7, doctor_id: 6, date: new Date('2024-03-06'), time: '1970-01-01T09:30:00Z', status: 'zrealizowana' },
      { patient_id: 8, doctor_id: 7, date: new Date('2024-03-06'), time: '1970-01-01T14:00:00Z', status: 'zarezerwowana' },
      { patient_id: 9, doctor_id: 8, date: new Date('2024-03-07'), time: '1970-01-01T15:00:00Z', status: 'zrealizowana' },
      { patient_id: 10, doctor_id: 9, date: new Date('2024-03-08'), time: '1970-01-01T11:00:00Z', status: 'zarezerwowana' },
      { patient_id: 11, doctor_id: 10, date: new Date('2024-03-09'), time: '1970-01-01T12:00:00Z', status: 'zarezerwowana' },
      { patient_id: 12, doctor_id: 3, date: new Date('2024-03-10'), time: '1970-01-01T10:00:00Z', status: 'zrealizowana' },
      { patient_id: 13, doctor_id: 5, date: new Date('2024-03-11'), time: '1970-01-01T09:00:00Z', status: 'zarezerwowana' },
      { patient_id: 14, doctor_id: 6, date: new Date('2024-03-12'), time: '1970-01-01T14:00:00Z', status: 'zrealizowana' },
      { patient_id: 15, doctor_id: 1, date: new Date('2024-03-13'), time: '1970-01-01T13:00:00Z', status: 'anulowana' },
    ],
    skipDuplicates: true,
  });
  
  await prisma.appointment_details.createMany({
  data: [
	 { appointment_id: 1, diagnosis: 'Podejrzenie nadciśnienia.', recommendations: 'Codziennie mierzyć ciśnienie krwi.', prescription: true },
	 { appointment_id: 2, diagnosis: 'Stan ogólny dobry.', recommendations: 'Kontynuować zdrowy tryb życia.', prescription: false },
	 { appointment_id: 3, diagnosis: 'Zapalenie skóry.', recommendations: 'Stosować maść dwa razy dziennie.', prescription: true },
	 { appointment_id: 4, diagnosis: 'Ból gardła.', recommendations: 'Płukanie ciepłą wodą z solą 3 razy dziennie.', prescription: false },
	 { appointment_id: 5, diagnosis: 'Bóle kręgosłupa.', recommendations: 'Ćwiczenia rozciągające i rehabilitacja.', prescription: false },
	 { appointment_id: 6, diagnosis: 'Migrena.', recommendations: 'Leki przeciwbólowe w razie potrzeby.', prescription: true },
	 { appointment_id: 7, diagnosis: 'Infekcja górnych dróg oddechowych.', recommendations: 'Antybiotyk przez 7 dni.', prescription: true },
	 { appointment_id: 8, diagnosis: 'Alergia sezonowa.', recommendations: 'Unikać alergenów i stosować leki przeciwhistaminowe.', prescription: false },
	 { appointment_id: 9, diagnosis: 'Krótkowzroczność.', recommendations: 'Zalecane okulary korekcyjne.', prescription: false },
	 { appointment_id: 10, diagnosis: 'Zmęczenie i stres.', recommendations: 'Odpoczynek, zdrowa dieta i regularny sen.', prescription: false },
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
