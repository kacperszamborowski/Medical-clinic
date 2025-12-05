import request from 'supertest';
import app from '../../app';
import { prisma } from '../../db/seed'

afterAll(async () => {
    await prisma.doctor.deleteMany({
      where: { license_number: "LIC123456"}
    });
  })

describe('Integration tests for /api/doctors', () => {
  it('GET /api/doctors returns all doctors', async () => {
    const response = await request(app).get('/api/doctors');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect([10, 11]).toContain(response.body.length);

    expect(response.body[0]).toHaveProperty('firstname');
    expect(response.body[0]).toHaveProperty('lastname');
    expect(response.body[0]).toHaveProperty('specialization');
  });

  it('GET /api/doctors?spec=Chirurg returns only surgeons', async () => {
    const response = await request(app)
      .get('/api/doctors')
      .query({ spec: 'Chirurg' });

    expect(response.status).toBe(200);
    expect([1, 2]).toContain(response.body.length);
    expect(response.body[0].specialization).toBe('Chirurg');
    expect(response.body[0].firstname).toBe('Tomasz');
    expect(response.body[0].lastname).toBe('Kos');
  });

  it('GET /api/doctors?spec=Unknown returns empty array', async () => {
    const response = await request(app)
      .get('/api/doctors')
      .query({ spec: 'Unknown' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /api/doctors creates a new doctor', async () => {
    const newDoctor = {
      firstname: "Mirosław",
      lastname: "Gągożelewski",
      specialization: "Chirurg",
      license_number: "LIC123456"
    }

    const response = await request(app).post('/api/doctors').send(newDoctor);

    expect(response.status).toBe(201);
    
    expect(response.body).toHaveProperty("id");
    expect(response.body.firstname).toBe(newDoctor.firstname);
    expect(response.body.lastname).toBe(newDoctor.lastname);
    expect(response.body.specialization).toBe(newDoctor.specialization);
    expect(response.body.license_number).toBe(newDoctor.license_number);

    const doctorInDb = await prisma.doctor.findUnique({
      where: { id: response.body.id },
    });
    expect(doctorInDb).not.toBeNull();
    expect(doctorInDb?.firstname).toBe(newDoctor.firstname);
  });
});
