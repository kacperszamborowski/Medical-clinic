import type { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";

export class ScheduleController {
    static async getSchedule(req: Request, res: Response) {
        try {
            const doctorId = Number(req.query.doctorId);
            const schedule = await ScheduleService.getSchedule(doctorId);
            res.json(schedule);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}