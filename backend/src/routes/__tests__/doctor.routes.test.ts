import request from 'supertest';
import app from '../../app';
import { prisma } from '../../db/prisma'

afterAll(async () => {
    await prisma.doctor.deleteMany({
      where: { license_number: "LIC123456"}
    });
  })

describe('Integration tests for /doctors', () => {
  it('GET /doctors returns all doctors', async () => {
    const auth = await request(app)
    .post('/auth/login')
    .send({
        email: 'anna.nowak@example.com',
        password: 'pass123'
    });

    const response = await request(app)
    .get('/doctors')
    .set("Authorization", "Bearer " + auth.body.token);;

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('specialization');
    expect(response.body[0]).toHaveProperty('user');
  });

  // it('POST /api/doctors creates a new doctor', async () => {
  //   const newDoctor = {
  //     firstname: "Mirosław",
  //     lastname: "Gągożelewski",
  //     specialization: "Chirurg",
  //     license_number: "LIC123456"
  //   }

  //   const response = await request(app).post('/api/doctors').send(newDoctor);

  //   expect(response.status).toBe(201);
    
  //   expect(response.body).toHaveProperty("id");
  //   expect(response.body.firstname).toBe(newDoctor.firstname);
  //   expect(response.body.lastname).toBe(newDoctor.lastname);
  //   expect(response.body.specialization).toBe(newDoctor.specialization);
  //   expect(response.body.license_number).toBe(newDoctor.license_number);

  //   const doctorInDb = await prisma.doctor.findUnique({
  //     where: { id: response.body.id },
  //   });
  //   expect(doctorInDb).not.toBeNull();
  //   expect(doctorInDb?.firstname).toBe(newDoctor.firstname);
  // });
});
