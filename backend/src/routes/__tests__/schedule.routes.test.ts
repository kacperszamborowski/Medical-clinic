import request from 'supertest';
import app from '../../app';

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

        expect(response.body[1].day_of_the_week).toEqual(4);
        expect(response.body[1].hour_from).toEqual((new Date("1970-01-01 08:00 UTC")).toISOString());
        expect(response.body[1].hour_to).toEqual((new Date("1970-01-01 16:00 UTC")).toISOString());
    });
});
