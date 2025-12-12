import type { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";
import { AppointmentStatus } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

export class AppointmentController {
    static async getPatientHistory(req: Request, res: Response) {
        try {
            const patientId = Number(req.query.patientId)
            const history = await AppointmentService.getPatientHistory(patientId);
            const cleaned = history.map(h => ({
                ...h,
                date: h.date.toISOString().substring(0, 10),
                time: h.time.toISOString().substring(11, 16)
            }))
            res.json(cleaned);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async setAppointmentStatus(req: Request, res: Response) {
        try {
            const appointmentId = Number(req.query.appointmentId);
            const newStatus = req.query.newStatus as AppointmentStatus;
            const updatedAppointment = await AppointmentService.setAppointmentStatus(appointmentId, newStatus);
            res.json(updatedAppointment);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createAppointment(req: AuthRequest, res: Response) {
        try {
            const data = {
                patientId: Number(req.user?.userId),
                doctorId: Number(req.body.doctorId),
                date: req.body.date as string,
                time: req.body.time as string
            };

            const newAppointment = await AppointmentService.createAppointment(
                data.patientId,
                data.doctorId,
                data.date,
                data.time
            );

            res.json(newAppointment);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}