import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);
            res.json(result);
        }
        catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { firstname, lastname, birth_date, email, password } = req.body.payload;
            const user = await authService.register(firstname, lastname, birth_date, email, password);
            res.status(201).json(user);
        }
        catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    }

    async changePassword(req: AuthRequest, res: Response) {
        try {
            if (req.user == undefined) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const email = req.user.email;
            const { oldPassword, newPassword } = req.body;

            const updatedUser = await authService.changePassword(email, oldPassword, newPassword);
            res.json(updatedUser);
        }
        catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    }
}

export const authController = new AuthController();
