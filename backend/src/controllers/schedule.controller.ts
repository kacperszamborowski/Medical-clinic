import type { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user.service";

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

    static async getMySchedule(req: AuthRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "Nieautoryzowany" });
        }

        const doctorId = await UserService.getDoctorIdByUserId(userId);
        if(!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        try {
            const schedule = await ScheduleService.getSchedule(doctorId);
            const cleaned = schedule.map((s) => ({
                ...s,
                hour_from: s.hour_from.toISOString().substring(11, 16),
                hour_to: s.hour_to.toISOString().substring(11, 16)
            }));
            res.json(cleaned);
        }        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}