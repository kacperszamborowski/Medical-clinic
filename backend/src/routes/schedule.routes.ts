import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";

const router: Router = Router();

router.get("/", ScheduleController.getSchedule);
export default router;