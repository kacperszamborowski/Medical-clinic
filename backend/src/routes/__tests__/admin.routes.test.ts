import request from 'supertest';
import app from '../../app';
import { Response } from 'superagent/lib/node';

let auth: Response;

beforeEach(async () => {
    auth = await request(app)
    .post('/auth/login')
    .send({
        email: 'admin@example.com',
        password: 'pass123'
    });
})

describe("Integration tests for admin privileges", () => {
    it("GET /users/table should return entire users table", async () => {
        const response = await request(app)
        .get("/users/table")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("firstname");
        expect(response.body[0]).toHaveProperty("lastname");
        expect(response.body[0]).toHaveProperty("birth_date");
        expect(response.body[0]).toHaveProperty("email");
        expect(response.body[0]).toHaveProperty("password");
        expect(response.body[0]).toHaveProperty("role");
        expect(response.body[0]).toHaveProperty("verified");
        expect(response.body[0]).toHaveProperty("created_at");
    });

    it("GET /schedule/table should return entire schedules table", async () => {
        const response = await request(app)
        .get("/schedule/table")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("doctor_id");
        expect(response.body[0]).toHaveProperty("day_of_the_week");
        expect(response.body[0]).toHaveProperty("hour_from");
        expect(response.body[0]).toHaveProperty("hour_to");
    });

    it("GET /doctors/table should return entire doctors table", async () => {
        const response = await request(app)
        .get("/doctors/table")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("user_id");
        expect(response.body[0]).toHaveProperty("specialization");
        expect(response.body[0]).toHaveProperty("license_number");
    });

    it("GET /appointments/table should return entire appointments table", async () => {
        const response = await request(app)
        .get("/appointments/table")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("patient_id");
        expect(response.body[0]).toHaveProperty("doctor_id");
        expect(response.body[0]).toHaveProperty("date");
        expect(response.body[0]).toHaveProperty("time");
        expect(response.body[0]).toHaveProperty("status");
        expect(response.body[0]).toHaveProperty("cancel_reason");
    });

    it("GET /appointments/details/table should return entire appointments details table", async () => {
        const response = await request(app)
        .get("/appointments/details/table")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("appointment_id");
        expect(response.body[0]).toHaveProperty("diagnosis");
        expect(response.body[0]).toHaveProperty("recommendations");
        expect(response.body[0]).toHaveProperty("prescription");
    });

    it("GET should return 5x status 403 for non-admin user", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'jan.kowalski@example.com',
            password: 'pass123'
        });

        let responses: Response[] = [];

        responses.push(await request(app)
        .get("/users/table")
        .set("Authorization", "Bearer " + auth.body.token));

        responses.push(await request(app)
        .get("/schedule/table")
        .set("Authorization", "Bearer " + auth.body.token));

        responses.push(await request(app)
        .get("/doctors/table")
        .set("Authorization", "Bearer " + auth.body.token));    

        responses.push(await request(app)
        .get("/appointments/table")
        .set("Authorization", "Bearer " + auth.body.token));

        responses.push(await request(app)
        .get("/appointments/details/table")
        .set("Authorization", "Bearer " + auth.body.token));

        responses.forEach(res => {
            expect(res.status).toBe(403);
        });
    });
})