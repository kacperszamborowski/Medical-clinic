import { prisma } from "../db/prisma";

export class UserService {
    static async getAllUsers() {
        return await prisma.user.findMany();
    }
}