import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/", ScheduleController.getSchedule);
router.get("/my", authMiddleware, ScheduleController.getMySchedule);
router.post("/my/create", authMiddleware, ScheduleController.createSchedule);
export default router;