import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.put("/password", authMiddleware, authController.changePassword);

export default router;
