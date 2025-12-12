import request from 'supertest';
import app from '../../app';
import { AppointmentStatus } from '@prisma/client';
import { prisma } from '../../db/prisma';

let newAppointmentId: number;

describe("Integration tests for /appointments", () => {
    it("GET /appointments/history?patientId=1 should return 1st patient's appointments history", async () => {
        const response = await request(app)
        .get("/appointments/history")
        .query({ patientId: 1 });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0].date).toEqual("2025-12-10");
        expect(response.body[0].time).toEqual("10:30");
        expect(response.body[0].status).toEqual(AppointmentStatus.zarezerwowana);
        expect(response.body[0].details).toBe(null);
        expect(response.body[0].specialization).toEqual("Kardiolog");
        expect(response.body[0].doctor).toEqual("Anna Nowak");
    });

    it("POST /appointments/status should update 3rd appointment's status to 'odwołana' and return it", async () => {
        const response = await request(app)
        .post("/appointments/status")
        .query({ appointmentId: 3, newStatus: "odwołana" });

        expect(response.status).toBe(200);
        expect(response.body.status).toEqual(AppointmentStatus.odwołana);
    });

    it("POST /appointments/create should create a new appointment for Katarzyna Wójcik", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'katarzyna.wojcik@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .post("/appointments/create")
        .send({
            doctorId: 2,
            date: "2025-12-11",
            time: "10:00"
        })
        .set("Authorization", "Bearer " + auth.body.token);
        newAppointmentId = response.body.id;

        expect(response.status).toBe(200);
        expect(response.body.date).toEqual((new Date("2025-12-11")).toISOString());
        expect(response.body.time).toEqual((new Date("1970-01-01 10:00 UTC")).toISOString());
    });

    it("POST /appointments/create should return status 500 for being invalid with schedule", async () => { 
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'katarzyna.wojcik@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .post("/appointments/create")
        .send({
            doctorId: 1,
            date: "2025-12-02",
            time: "10:00"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(500);
    });

    it("POST /appointments/create should return status 500 for being invalid with schedule", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'katarzyna.wojcik@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .post("/appointments/create")
        .send({
            doctorId: 1,
            date: "2025-12-01",
            time: "08:00"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(500);
    });

    it("POST /appointments/create should return status 500 for being already taken", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'katarzyna.wojcik@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .post("/appointments/create")
        .send({
            doctorId: 2,
            date: "2025-12-12",
            time: "09:00"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(500);
    });

    afterAll(async () => {
        await prisma.appointment.update({
            where: { id: 3 },
            data: {
                status: AppointmentStatus.zarezerwowana
            }
        });

        await prisma.appointment.delete({
            where: { id: newAppointmentId }
        });
    });
});
