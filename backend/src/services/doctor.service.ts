import { prisma } from "../db/prisma";

export class DoctorService {
    static async createDoctor(
        data: {
        firstname: string, 
        lastname: string, 
        specialization: string, 
        license_number: string
    }) {
        return await prisma.doctor.create({data: data});
    }

    static async getDoctors(spec?: string) {
        return await prisma.doctor.findMany({
            where: spec ? { specialization: spec } : undefined,
            select: {
                firstname: true,
                lastname: true,
                specialization: true
            }
        });
    }
}