import type { Request, Response } from "express";
import { DoctorService } from "../services/doctor.service";

export class DoctorController {
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