import request from 'supertest';
import app from '../../app';
import { UserRole } from '@prisma/client';
import { prisma } from '../../db/prisma';

describe("Integration test for /users", () => {
    it("GET /users/me should return user data", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'jan.kowalski@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("firstname");
        expect(response.body).toHaveProperty("role");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body.email).toEqual("jan.kowalski@example.com");
    });

    it("GET /users/me should return doctor data", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'anna.nowak@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("firstname");
        expect(response.body).toHaveProperty("role");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("specialization");
        expect(response.body).toHaveProperty("license_number");
        expect(response.body.email).toEqual("anna.nowak@example.com");
        expect(response.body.specialization).toEqual("Kardiolog");
        expect(response.body.license_number).toEqual("LEK12345");
    });

    it("POST /users/newdoctor should create a new doctor user", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'admin@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .post("/users/newdoctor")
        .send({
            payload: {
                firstname: "Nowy",
                lastname: "Lekarz",
                birthDate: new Date("1980-05-05"),
                email: "nowy.lekarz@example.com",
                password: "newPass123",
                specialization: "Specjalista",
                licenseNumber: "SPEC369"
            }
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("firstname");
        expect(response.body).toHaveProperty("password");
        expect(response.body).toHaveProperty("created_at");
        expect(response.body.role).toEqual(UserRole.doctor);
        expect(response.body.specialization).toEqual("Specjalista");
        expect(response.body.license_number).toEqual("SPEC369");

        await prisma.doctor.delete({
            where: { user_id: response.body.id }
        });
        await prisma.user.delete({
            where: { id: response.body.id }
        });
    });

    it("POST /users/newdoctor should return status 403 for non-admin user", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'michal.kaminski@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .post("/users/newdoctor")
        .send({
            firstname: "Nowy",
            lastname: "Doktor",
            birthDate: new Date("1980-05-05"),
            email: "nowy.doktor@example.com",
            password: "newPass123",
            specialization: "Specjalista",
            licenseNumber: "SPEC369"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(403);
    });
})