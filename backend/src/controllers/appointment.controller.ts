import type { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";
import { AppointmentStatus } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user.service";

export class AppointmentController {
    static async getPatientHistory(req: AuthRequest, res: Response) {
        try {
            const patientId = Number(req.user?.userId);
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

    static async getBusyHours(req: AuthRequest, res: Response) {
        try {
            const date = String(req.query.date);
            const busyHours = await AppointmentService.getBusyHours(date);
            const cleaned = busyHours.map(h => ({
                time: h.time.toISOString().substring(11, 16)
            }));
            res.json(cleaned);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async setAppointmentStatus(req: AuthRequest, res: Response) {
        try {
            const doctorId = await UserService.getDoctorIdByUserId(Number(req.user?.userId));
            const appointmentId = Number(req.body.appointmentId);
            const newStatus = req.body.newStatus as AppointmentStatus;

            const authorized = await (async () => { 
                const appointment = await AppointmentService.getAppointment(appointmentId);
                return appointment?.doctor_id == doctorId;
            })();

            if (!authorized) {
                res.status(403).json({ message: "Cannot modify someone else's appointment!" });
                return;
            }

            const updatedAppointment = await AppointmentService
            .setAppointmentStatus(appointmentId, newStatus);
            res.json(updatedAppointment);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createAppointment(req: AuthRequest, res: Response) {
        console.log("Creating appointment...");
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