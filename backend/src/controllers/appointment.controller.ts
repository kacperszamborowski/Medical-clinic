import type { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";

export class AppointmentController {
    static async getPatientHistory(req: Request, res: Response) {
        try {
            const patientId = Number(req.query.patientId)
            const history = await AppointmentService.getPatientHistory(patientId);
            res.json(history);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}