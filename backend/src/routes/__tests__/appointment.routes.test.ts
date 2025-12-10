import request from 'supertest';
import app from '../../app';
import { AppointmentStatus } from '@prisma/client';
import { after } from 'node:test';

describe("Integration tests for /appointments", () => {
    it("GET /appointments/history?patientId=1 should return 1st patient's appointments history", async () => {
        const response = await request(app)
        .get("/appointments/history")
        .query({ patientId: 1 });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0].date).toEqual((new Date("2025-12-10")).toISOString());
        expect(response.body[0].time).toEqual((new Date("1970-01-01 10:30 UTC")).toISOString());
        expect(response.body[0].status).toEqual(AppointmentStatus.zarezerwowana);
        expect(response.body[0].appointmentDetails).toBe(null);
        expect(response.body[0].doctor.specialization).toEqual("Kardiolog");
        expect(response.body[0].doctor.user.firstname).toEqual("Anna");
        expect(response.body[0].doctor.user.lastname).toEqual("Nowak");
    });

    it("POST /appointment/status should update 3rd appointment's status to 'odwołana' and return it", async () => {
        const response = await request(app)
        .post("/appointments/status")
        .query({ appointmentId: 3, newStatus: "odwołana" });

        expect(response.status).toBe(200);
        expect(response.body.status).toEqual(AppointmentStatus.odwołana);
    });

    afterAll(async () => {
        await request(app)
        .post("/appointments/status")
        .query({ appointmentId: 3, newStatus: "zarezerwowana" });
    });
});
