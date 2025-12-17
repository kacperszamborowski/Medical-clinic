import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/", authMiddleware, ScheduleController.getSchedule);
router.get("/table", authMiddleware, ScheduleController.getSchedulesTable);
router.get("/my", authMiddleware, ScheduleController.getMySchedule);
router.post("/my/create", authMiddleware, ScheduleController.createSchedule);
router.put("/my/edit", authMiddleware, ScheduleController.updateSchedule);
router.delete("/my/delete", authMiddleware, ScheduleController.deleteSchedule);
export default router;