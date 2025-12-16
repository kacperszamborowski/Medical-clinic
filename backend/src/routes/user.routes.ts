import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/table", authMiddleware, UserController.getUsersTable);
export default router;