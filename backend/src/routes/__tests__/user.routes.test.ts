import request from 'supertest';
import app from '../../app';
import bcrypt from "bcrypt";

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

    const hashed = "$2b$10$1DsIjoePz3dHhcrKdjBjKuUXNfJPauSEUqCnRNqMKOUV2rqWtwa/a";
    expect(response.body[4]).toEqual({
      id: 5,
      firstname: "Michał",
      lastname: "Kamiński",
      birth_date: (new Date("1982-06-08")).toISOString(),
      email: "michal.kaminski@example.com",
      password: hashed,
      role: "doctor",
      created_at: "2025-12-05T15:31:04.566Z",
      verified: true,
    })
  });
});
