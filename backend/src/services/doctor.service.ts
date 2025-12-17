import { UserRole } from "@prisma/client";
import { prisma } from "../db/prisma";

export class DoctorService {
    static async getDoctorsTable() {
        return await prisma.doctor.findMany();
    }

    static async getAllDoctors() {
        const doctors = await prisma.doctor.findMany({
            select: {
                id: true,
                specialization: true,
                user: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });
        
        return doctors.map(d => ({
            id: d.id,
            specialization: d.specialization,
            name: `${d.user.firstname} ${d.user.lastname}`
        }));
    }

    static async createDoctor(userId: number, specialization: string, licenseNumber: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (user == undefined || user.role != UserRole.doctor) {
            throw new Error("This user does not exist or is not a doctor.");
        }
        
        return await prisma.doctor.create({
            data: {
                user_id: userId,
                specialization: specialization,
                license_number: licenseNumber
            }
        });
    }
}