import type { Request, Response } from "express";
import { PatientService } from "../services/patient.service";

export class PatientController {
    static async createPatient(req: Request, res: Response) {
        try {
            const { firstname, lastname, birth_date, email, phone } = req.body;
            if (!firstname || !lastname || !birth_date || !email || !phone) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            const newPatient = await PatientService.createPatient({
                firstname,
                lastname,
                birth_date,
                email,
                phone,
            });

            res.status(201).json(newPatient);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

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