import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller";

const router: Router = Router();

router.get("/", DoctorController.getDoctors);
router.post("/", DoctorController.createDoctor);
export default router;