import request from 'supertest';
import app from '../../app';
import { prisma } from "../../db/prisma";

describe("Integration tests for /schedule", () => {
    it("GET /schedule?doctorId=2 should return 2nd doctor's schedule", async () => {
        const response = await request(app)
        .get("/schedule")
        .query({ doctorId: 2 });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0].day_of_the_week).toEqual(2);
        expect(response.body[0].hour_from).toEqual((new Date("1970-01-01 08:00 UTC")).toISOString());
        expect(response.body[0].hour_to).toEqual((new Date("1970-01-01 16:00 UTC")).toISOString());
        expect(response.body[0].doctor.specialization).toEqual("Dermatolog");
        expect(response.body[0].doctor.user.firstname).toEqual("Michał");
        expect(response.body[0].doctor.user.lastname).toEqual("Kamiński");

        expect(response.body[1].day_of_the_week).toEqual(4);
        expect(response.body[1].hour_from).toEqual((new Date("1970-01-01 08:00 UTC")).toISOString());
        expect(response.body[1].hour_to).toEqual((new Date("1970-01-01 16:00 UTC")).toISOString());
    });

    let scheduleId: number;
    let authToken: string;

    it("POST /schedule/my/create should create a schedule for logged in doctor", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'anna.nowak@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .post("/schedule/my/create")
        .send({
            dayOfTheWeek: 3,
            hourFrom: "07:30",
            hourTo: "15:30"
        })
        .set("Authorization", "Bearer " + auth.body.token);
        scheduleId = response.body.id;

        expect(response.body.doctor_id).toBe(1);
        expect(response.body.hour_to).toBe((new Date("1970-01-01 15:30 UTC")).toISOString());
    });

    afterAll(async () => {
        prisma.schedule.delete({
            where: { id: scheduleId }
        });
    });
})
