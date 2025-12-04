import request from 'supertest';
import app from '../../app';

describe('Integration tests for /api/users', () => {
  it('GET /api/users returns all users', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // expect(response.body.length).toBe(2);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('password');
    expect(response.body[0]).toHaveProperty('role');
    expect(response.body[0]).toHaveProperty('createdAt');
  });
});
