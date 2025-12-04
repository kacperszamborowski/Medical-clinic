import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller";

const router: Router = Router();

router.get("/", DoctorController.getDoctors);
export default router;