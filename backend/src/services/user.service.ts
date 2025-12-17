import { UserRole } from "@prisma/client";
import { prisma } from "../db/prisma";

export class UserService {
    static async getUser(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstname: true,
                lastname: true,
                email: true,
                birth_date: true,
                created_at: true,
                role: true,
                verified: true
            }
        });

        if (user == undefined) {
            throw new Error("User not found");
        }

        if (user.role === UserRole.doctor) {
            const doctor = await prisma.doctor.findUnique({
                where: { user_id: userId },
                select: {
                    specialization: true,
                    license_number: true,
                }
            });
            

            if (doctor == undefined) {
                throw new Error("Doctor not found");
            }

            const data = {
                ...user,
                specialization: doctor.specialization,
                license_number: doctor.license_number
            }

            return data;
        }
        else {
            return user;
        }
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