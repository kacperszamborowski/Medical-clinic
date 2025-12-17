import bcrypt from "bcrypt";
import { signAccessToken } from "../utils/jwt";
import { prisma } from '../db/prisma';

class AuthService {
    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ 
            where: { email } 
        });
        if (!user) {
            throw new Error("User not found");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid password");
        }

        const token = signAccessToken({ 
            userId: user.id, 
            email: user.email, 
            role: user.role 
        });

        return { token, user };
    }

    async register(
        firstname: string,
        lastname: string,
        birth_date: string,
        email: string,
        password: string,
        role: string) {
        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { 
                firstname, 
                lastname, 
                birth_date, 
                email, 
                password: hashed, 
                role 
            }
        });

        return user;
    }

    async changePassword(email: string, oldPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!user) {
            throw new Error("User not found");
        }

        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            throw new Error("Invalid password")
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: { password: hashed }
        });

        return updatedUser;
    }
}

export const authService = new AuthService();