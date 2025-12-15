import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { AppointmentDetailsController } from "../controllers/appointment.details.controller";

const router: Router = Router();

router.post("/create", authMiddleware, AppointmentDetailsController.createAppointmentDetails);
router.put("/update", authMiddleware, AppointmentDetailsController.updateAppointmentDetails);
export default router;