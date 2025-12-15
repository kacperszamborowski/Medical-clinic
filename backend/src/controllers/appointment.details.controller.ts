import type { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user.service";
import { AppointmentDetailsService } from "../services/appointment.details.service";

export class AppointmentDetailsController {
    static async createAppointmentDetails(req: AuthRequest, res: Response) {
        try {
            const doctorId = await UserService.getDoctorIdByUserId(Number(req.user?.userId));
            const appointmentId = Number(req.body.appointmentId);

            const allowed = await (async () => { 
                const appointment = await AppointmentService.getAppointment(appointmentId);
                return appointment?.doctor_id == doctorId;
            })();

            if (!allowed) {
                res.status(403).json({ message: "Cannot modify someone else's appointment!" });
                return;
            }

            const data = {
                diagnosis: req.body.diagnosis as string,
                recommendations: req.body.recommendations as string,
                prescription: req.body.prescription as boolean
            };

            const newDetails = await AppointmentDetailsService.createAppointmentDetails(
                appointmentId,
                data.diagnosis,
                data.recommendations,
                data.prescription
            );
            res.json(newDetails);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateAppointmentDetails(req: AuthRequest, res: Response) {
        try {
            const doctorId = await UserService.getDoctorIdByUserId(Number(req.user?.userId));
            const appointmentId = Number(req.body.appointmentId);

            const allowed = await (async () => { 
                const appointment = await AppointmentService.getAppointment(appointmentId);
                return appointment?.doctor_id == doctorId;
            })();

            if (!allowed) {
                res.status(403).json({ message: "Cannot modify someone else's appointment!" });
                return;
            }
 
            const data = {
                diagnosis: req.body.diagnosis as string,
                recommendations: req.body.recommendations as string,
                prescription: req.body.prescription as boolean
            };

            const updatedDetails = await AppointmentDetailsService.updateAppointmentDetails(
                appointmentId,
                data.diagnosis,
                data.recommendations,
                data.prescription
            );
            res.json(updatedDetails);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}