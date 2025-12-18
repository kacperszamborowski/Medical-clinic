import { UserRole } from "@prisma/client";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";

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

    static async createDoctorUser(
        firstname: string,
        lastname: string,
        birthDate: Date,
        email: string,
        password: string,
        specialization: string,
        licenseNumber: string
    ) {
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                birth_date: birthDate,
                email: email,
                password: hashed,
                role: UserRole.doctor
            }
        });

        const newDoctor = await prisma.doctor.create({
            data: {
                user_id: newUser.id,
                specialization: specialization,
                license_number: licenseNumber,
            }
        });

        return {
            ...newUser,
            specialization: newDoctor.specialization,
            license_number: newDoctor.license_number
        };
    }

    static async verifyUser(userId: number) {
        return await prisma.user.update({
            where: { id: userId },
            data: { verified: true }
        });
    }
}