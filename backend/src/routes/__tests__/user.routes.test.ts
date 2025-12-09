import request from 'supertest';
import app from '../../app';

describe('Integration tests for /users', () => {
  it('GET should return all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('firstname');
    expect(response.body[0]).toHaveProperty('lastname');
    expect(response.body[0]).toHaveProperty('birth_date');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('password');
    expect(response.body[0]).toHaveProperty('role');
    expect(response.body[0]).toHaveProperty('created_at');
    expect(response.body[0]).toHaveProperty('verified');

    expect(response.body[4].email).toEqual("michal.kaminski@example.com");
    expect(response.body[4].birth_date).toEqual(new Date("1982-06-08").toISOString());
  });
});
