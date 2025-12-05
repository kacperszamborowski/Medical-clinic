import type { Request, Response } from "express";
import { DoctorService } from "../services/doctor.service";

export class DoctorController {
    static async createDoctor(req: Request, res: Response) {
        try {
            const { firstname, lastname, specialization, license_number } = req.body;
            if (!firstname || !lastname || !specialization || !license_number) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            const newDoctor = await DoctorService.createDoctor({
                firstname,
                lastname,
                specialization,
                license_number
            });

            res.status(201).json(newDoctor);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async getDoctors(req: Request, res: Response) {
        try {
            const spec = req.query.spec as string | undefined;
            const doctors = await DoctorService.getDoctors(spec);
            res.json(doctors);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}