import request from 'supertest';
import app from '../../app';
import { prisma } from '../../db/prisma'

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
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('specialization');
        expect(response.body[0]).toHaveProperty('name');
    });
});
