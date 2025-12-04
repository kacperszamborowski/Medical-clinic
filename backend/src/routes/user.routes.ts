import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router: Router = Router();

router.get("/", UserController.getAllUsers);
export default router;