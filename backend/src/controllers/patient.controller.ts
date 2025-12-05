import type { Request, Response } from "express";
import { PatientService } from "../services/patient.service";

export class PatientController {
    static async getPatients(req: Request, res: Response) {
        try {
            const patients = await PatientService.getPatients();
            res.json(patients);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}