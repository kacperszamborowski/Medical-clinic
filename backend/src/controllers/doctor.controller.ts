import type { Request, Response } from "express";
import { DoctorService } from "../services/doctor.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

export class DoctorController {
    static async getDoctorsTable(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role != UserRole.admin) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }
            
            const doctors = await DoctorService.getDoctorsTable();
            res.json(doctors);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }   
    }

    static async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await DoctorService.getAllDoctors();
            res.json(doctors);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}