import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";

const router: Router = Router();

router.get("/", PatientController.getPatients);
router.post("/", PatientController.createPatient)
export default router;