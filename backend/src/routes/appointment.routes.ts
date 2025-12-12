import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/history", authMiddleware, AppointmentController.getPatientHistory);
router.get("/visits", authMiddleware, AppointmentController.getDoctorHistory);
router.put("/status", authMiddleware, AppointmentController.setAppointmentStatus);
router.post("/create", authMiddleware, AppointmentController.createAppointment);
router.get("/busy", authMiddleware, AppointmentController.getBusyHours);
export default router;