import type { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}