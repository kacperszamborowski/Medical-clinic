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
}