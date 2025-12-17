import type { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

export class UserController {
    static async getUsersTable(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role != UserRole.admin) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }
            
            const users = await UserService.getUsersTable();
            res.json(users);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async verifyUser(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role != UserRole.admin) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }
            
            const userId = Number(req.body.userId);
            const user = await UserService.getUser(userId);

            if (user?.verified) {
                res.status(400).json({ message: "User already verified " });
                return;
            }

            const verifiedUser = await UserService.verifyUser(userId)
            res.json(verifiedUser);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}