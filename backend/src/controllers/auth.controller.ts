import { Request, Response } from "express";
import { authService } from "../services/auth.service";

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
      const { firstname, lastname, birth_date, email, password, role } = req.body;

      const user = await authService.register(firstname, lastname, birth_date, email, password, role);
      res.status(201).json(user);
    } 
    catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}

export const authController = new AuthController();
