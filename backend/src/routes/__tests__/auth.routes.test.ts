import request from 'supertest';
import app from '../../app';
import { prisma } from '../../db/prisma';

describe('Auth Endpoints', () => {
  let token: string;

    afterAll(async () => {
      await prisma.user.delete({
        where: { email: 'test1@example.com' },
      });
    });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstname: 'test',
        lastname: 'example',
        birth_date: (new Date('1990-07-16')).toISOString(),
        email: 'test1@example.com',
        password: '!password123',
        role: 'patient'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login and return JWT token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'jan.kowalski@example.com',
        password: 'pass123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
    console.log(token)
  });
});
