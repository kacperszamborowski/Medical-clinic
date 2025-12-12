import request from 'supertest';
import app from '../../app';
import { AppointmentStatus } from '@prisma/client';
import { prisma } from '../../db/prisma';

let newAppointmentId: number;

describe("Integration tests for /appointments", () => {
    it("GET /appointments/history should return logged in patient's appointments history", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'katarzyna.wojcik@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .get("/appointments/history")
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0].date).toEqual("2025-12-12");
        expect(response.body[0].time).toEqual("09:00");
        expect(response.body[0].status).toEqual(AppointmentStatus.zarezerwowana);
        expect(response.body[0].details).toBe(null);
        expect(response.body[0].specialization).toEqual("Dermatolog");
        expect(response.body[0].doctor).toEqual("Michał Kamiński");
    });

    it("GET /appointments/visits should return logged in doctor's reserved appointments", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'anna.nowak@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .get("/appointments/visits")
        .query({ status: "zarezerwowana" })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0].date).toEqual("2025-12-10");
        expect(response.body[0].time).toEqual("10:30");
        expect(response.body[0].status).toEqual(AppointmentStatus.zarezerwowana);
    });

    it("GET /appointments/visits should return logged in doctor's realized appointments", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'anna.nowak@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .get("/appointments/visits")
        .query({ status: "zrealizowana" })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body[0].date).toEqual("2025-12-11");
        expect(response.body[0].time).toEqual("11:30");
        expect(response.body[0].status).toEqual(AppointmentStatus.zrealizowana);
        expect(response.body[0].details.diagnosis).toBe("Nadciśnienie");
    });

    it("GET /appointments/busy should return busy hours for specified date and specified doctor", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'katarzyna.wojcik@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .get("/appointments/busy")
        .query({ 
            doctorId: 2, 
            date: "2025-12-12"
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body[0].time).toBe("09:00");
    });

    it("PUT /appointments/status should update 3rd appointment's status to 'odwołana'", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'michal.kaminski@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .put("/appointments/status")
        .send({ appointmentId: 3, newStatus: "odwołana" })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        expect(response.body.status).toEqual(AppointmentStatus.odwołana);
    });

    it("PUT /appointments/status should return status 403 for trying to modify someone else's appointment", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'michal.kaminski@example.com',
            password: 'pass123'
        });
        
        const response = await request(app)
        .put("/appointments/status")
        .send({ appointmentId: 1, newStatus: "odwołana" })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(403);
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
