import request from 'supertest';
import app from '../../app';
import { AppointmentStatus } from '@prisma/client';
import { prisma } from '../../db/prisma';

describe("Integration tests for /appointments/details", () => {
    it("POST /appointments/details/create should create details for 1st appointment", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'anna.nowak@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .post("/appointments/details/create")
        .send({
            appointmentId: 1,
            diagnosis: "Niedomykalność zastawki",
            recommendations: "Leki na serce",
            prescription: true
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        
        expect(response.body.diagnosis).toEqual("Niedomykalność zastawki");
        expect(response.body.prescription).toBe(true);
        
        await prisma.appointment_details.delete({
            where: { appointment_id: response.body.appointment_id }
        });
    });

    it("PUT /appointments/details/update should update details for 2nd appointment", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'anna.nowak@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .put("/appointments/details/update")
        .send({
            appointmentId: 2,
            diagnosis: "Nadciśnienie tętnicze",
            prescription: false
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(200);
        
        expect(response.body.diagnosis).toEqual("Nadciśnienie tętnicze");
        expect(response.body.recommendations).toEqual("Zdrowa dieta i regularna aktywność fizyczna");
        expect(response.body.prescription).toBe(false);
        
        await prisma.appointment_details.update({
            where: { appointment_id: response.body.appointment_id },
            data: {
                diagnosis: "Nadciśnienie",
                prescription: true
            }
        });
    });

    it("PUT /appointments/details/update should return status 403 for trying to modify someone else's appointment", async () => {
        const auth = await request(app)
        .post('/auth/login')
        .send({
            email: 'michal.kaminski@example.com',
            password: 'pass123'
        });

        const response = await request(app)
        .put("/appointments/details/update")
        .send({
            appointmentId: 2,
            diagnosis: "Nadciśnienie tętnicze",
        })
        .set("Authorization", "Bearer " + auth.body.token);

        expect(response.status).toBe(403);
    });
});