import request from 'supertest';
import app from '../../app';

describe('Integration tests for /api/patient', () => {
  it('GET /api/patients returns all patients', async () => {
    const response = await request(app).get('/api/patients');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(20);

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
});
