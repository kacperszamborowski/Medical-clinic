import { prisma } from "../db/prisma";

export class UserService {
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
}