import { prisma } from "../db/prisma";

export class UserService {
    static async getUser(userId: number) {
        return await prisma.user.findUnique({
            where: { id: userId }
        });
    }

    static async getUsersTable() {
        return await prisma.user.findMany();
    }

    static async getDoctorIdByUserId(userId: number) {
        const doctor = await prisma.doctor.findUnique({
            where: { user_id: userId }
        });
        if (!doctor) {
            throw new Error("Doctor not found");
        }
        return doctor.id;
    }

    static async verifyUser(userId: number) {
        return await prisma.user.update({
            where: { id: userId },
            data: { verified: true }
        });
    }
}