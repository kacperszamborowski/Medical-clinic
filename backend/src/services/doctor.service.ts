import { prisma } from "../db/prisma";

export class DoctorService {
    // static async createDoctor(
    //     data: {
    //     firstname: string, 
    //     lastname: string, 
    //     specialization: string, 
    //     license_number: string
    // }) {
    //     return await prisma.doctor.create({data: data});
    // }

    static async getAllDoctors() {
        return await prisma.doctor.findMany({
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
    }
}