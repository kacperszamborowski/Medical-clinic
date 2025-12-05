import request from 'supertest';
import app from '../../app';
import { prisma } from '../../db/seed'

afterAll(async () => {
  await prisma.patient.deleteMany({
    where: {  email: "janusz.testowy@mymail.com"  }
  })
})

describe('Integration tests for /api/patient', () => {
  it('GET /api/patients returns all patients', async () => {
    const response = await request(app).get('/api/patients');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect([20, 21]).toContain(response.body.length);

    expect(response.body[0]).toHaveProperty('firstname');
    expect(response.body[0]).toHaveProperty('lastname');
    expect(response.body[0]).toHaveProperty('birth_date');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('phone');

    expect(response.body[4]).toEqual({
      firstname: "Agnieszka", 
      lastname: "Kowalczyk", 
      birth_date: "1985-05-30T00:00:00.000Z", 
      phone: "501000005",
      email: "agnieszka.kowalczyk@example.com"
    })
  });

  it('POST /api/patients creates a new patient', async () => {
    const newPatient = {
      firstname: "Janusz",
      lastname: "Testowy",
      birth_date: "2000-01-18T00:00:00.000Z",
      email: "janusz.testowy@mymail.com",
      phone: "500123456"
    };
    const response = await request(app).post('/api/patients').send(newPatient);

    expect(response.status).toBe(201);
    
    expect(response.body).toHaveProperty("id");
    expect(response.body.firstname).toBe(newPatient.firstname);
    expect(response.body.lastname).toBe(newPatient.lastname);
    expect(response.body.email).toBe(newPatient.email);
    expect(response.body.phone).toBe(newPatient.phone);
    expect(new Date(response.body.birth_date)).toEqual(new Date(newPatient.birth_date));

    const patientInDb = await prisma.patient.findUnique({
      where: { id: response.body.id },
    });
    expect(patientInDb).not.toBeNull();
    expect(patientInDb?.firstname).toBe(newPatient.firstname);
  });
});
