import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/table", authMiddleware, UserController.getUsersTable);
router.put("/verify", authMiddleware, UserController.verifyUser);
export default router;