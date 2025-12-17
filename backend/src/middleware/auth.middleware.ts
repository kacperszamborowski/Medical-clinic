import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

export interface AuthRequest extends Request {
    user?: { userId: number, email: string, role: UserRole }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token" });

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        (req as AuthRequest).user = decoded as { userId: number, email: string, role: UserRole };
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};