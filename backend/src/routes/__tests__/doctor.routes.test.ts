import request from 'supertest';
import app from '../../app';

describe('Integration tests for /api/doctors', () => {
  it('GET /api/doctors returns all doctors', async () => {
    const response = await request(app).get('/api/doctors');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(10);

    expect(response.body[0]).toHaveProperty('firstname');
    expect(response.body[0]).toHaveProperty('lastname');
    expect(response.body[0]).toHaveProperty('specialization');
  });

  it('GET /api/doctors?spec=Chirurg returns only surgeons', async () => {
    const response = await request(app)
      .get('/api/doctors')
      .query({ spec: 'Chirurg' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
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
});
