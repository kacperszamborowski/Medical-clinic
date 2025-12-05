import { prisma } from "../db/seed";

export class UserService {
    static async getAllUsers() {
        return await prisma.user.findMany();
    }
}