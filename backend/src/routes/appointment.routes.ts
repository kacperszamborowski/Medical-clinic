import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/history", authMiddleware, AppointmentController.getPatientHistory);
router.get("/visits-upcoming", authMiddleware, AppointmentController.getDoctorReservedAppointments);
router.get("/visits-history", authMiddleware, AppointmentController.getDoctorHistory);
router.put("/status", authMiddleware, AppointmentController.setAppointmentStatus);
router.post("/create", authMiddleware, AppointmentController.createAppointment);
router.get("/busy", authMiddleware, AppointmentController.getBusyHours);
router.get("/isregistered", authMiddleware, AppointmentController.doesPatientHaveAppointment);
export default router;