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
}