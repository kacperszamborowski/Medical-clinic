import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";

const router: Router = Router();

router.get("/", PatientController.getPatients);
export default router;