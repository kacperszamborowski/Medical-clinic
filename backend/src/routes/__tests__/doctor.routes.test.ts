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

    it("POST /doctors/create should create a new doctor", async () => {
        const register = await request(app)
        .post('/auth/register')
        .send({
            firstname: 'test',
            lastname: 'doc',
            birth_date: (new Date('1990-07-16')).toISOString(),
            email: 'testdoc@example.com',
            password: 'pass123',
            role: 'doctor'
        });

        prisma.user.update({
            where: { email: "testdoc@example.com"},
            data: { verified: true }
        });

        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'admin@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .post("/doctors/create")
        .send({
            userId: register.body.id,
            specialization: "testSpec",
            licenseNumber: "fakeLic3nse"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body.specialization).toEqual("testSpec");

        await prisma.doctor.delete({
            where: { user_id: register.body.id }
        });

        await prisma.user.delete({
            where: { email: "testdoc@example.com"}
        });
    });
});
