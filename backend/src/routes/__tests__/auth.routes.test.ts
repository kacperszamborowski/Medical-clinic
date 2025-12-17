import request from 'supertest';
import app from '../../app';
import bcrypt from "bcrypt";
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
    });

    it('should change password for user with id=1', async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'jan.kowalski@example.com',
            password: 'pass123'
        });
        
        const res = await request(app)
        .put("/auth/password")
        .send({
            oldPassword: "pass123",
            newPassword: "test789"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        const user = await prisma.user.findUnique({
            where: { id: 1 },
            select: { password: true }
        });

        if (user != undefined) {
            const match = await bcrypt.compare("test789", user.password);
            expect(match).toBe(true);

            await prisma.user.update({
                where: { id: 1 },
                data: { password: "$2b$10$IvH3GGzYKwR4KE5wXuj6supXoi6VvYWAcFs6cd2GHxHFR5s8oPLou" }
            });
        }
        else {
            fail("User was not found");
        }
    });

    it('should fail to change password', async () => {
        const res1 = await request(app)
        .put("/auth/password")
        .send({
            oldPassword: "pass123",
            newPassword: "test789"
        });

        expect(res1.status).toBe(401);
        
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'jan.kowalski@example.com',
            password: 'pass123'
        });
        
        const res2 = await request(app)
        .put("/auth/password")
        .send({
            oldPassword: "wrongPass",
            newPassword: "test789"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(res2.status).toBe(400);
    });
});
