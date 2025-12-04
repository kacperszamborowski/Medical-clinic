import { prisma } from "../db/seed";

export class UserService {
    async createUser(data: {email: string; password: string; role: string}) {
        return await prisma.user.create({data: data});
    }

    async getAllUsers() {
        return await prisma.user.findMany();
    }
}