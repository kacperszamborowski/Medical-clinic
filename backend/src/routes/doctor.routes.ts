import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/", authMiddleware, DoctorController.getAllDoctors);
router.get("/table", authMiddleware, DoctorController.getDoctorsTable);
export default router;