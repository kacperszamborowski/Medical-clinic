import type { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user.service";

export class ScheduleController {
    static async getSchedule(req: Request, res: Response) {
        try {
            const doctorId = Number(req.query.doctorId);
            const schedule = await ScheduleService.getSchedule(doctorId);
            const cleaned = schedule.map((s) => ({
                ...s,
                hour_from: s.hour_from.toISOString().substring(11, 16),
                hour_to: s.hour_to.toISOString().substring(11, 16)
            }));
            res.json(cleaned);
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

    static async createSchedule(req: AuthRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "Nieautoryzowany" });
        }

        const doctorId = await UserService.getDoctorIdByUserId(userId);
        if(!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        try {
            const data = {
                dayOfTheWeek: Number(req.body.dayOfTheWeek),
                hourFrom: req.body.hourFrom as string,
                hourTo: req.body.hourTo as string
            };

            const newSchedule = await ScheduleService.createSchedule(
                doctorId,
                data.dayOfTheWeek,
                data.hourFrom,
                data.hourTo
            );

            return res.json(newSchedule);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateSchedule(req: AuthRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "Nieautoryzowany" });
        }

        const doctorId = await UserService.getDoctorIdByUserId(userId);
        if(!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        try {
            const data = {
                scheduleId: req.body.scheduleId as number,
                dayOfTheWeek: req.body.dayOfTheWeek as number,
                hourFrom: req.body.hourFrom as string,
                hourTo: req.body.hourTo as string
            };

            const updatedSchedule = await ScheduleService.updateSchedule(
                data.scheduleId,
                doctorId,
                data.dayOfTheWeek,
                data.hourFrom,
                data.hourTo
            );

            return res.json(updatedSchedule);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteSchedule(req: AuthRequest, res: Response) {
        const scheduleId = req.body.scheduleId;
        try {
            const deleted = await ScheduleService.deleteSchedule(scheduleId);
            return res.json(deleted);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}