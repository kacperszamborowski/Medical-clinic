import request from 'supertest';
import app from '../../app';

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
})