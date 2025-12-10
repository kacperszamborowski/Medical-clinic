import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";

const router: Router = Router();

router.get("/history", AppointmentController.getPatientHistory);
router.post("/status", AppointmentController.setAppointmentStatus);
export default router;