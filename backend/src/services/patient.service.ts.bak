import { prisma } from "../db/seed";

export class PatientService {
    static async createPatient(
        data: {
        firstname: string, 
        lastname: string, 
        birth_date: Date,
        phone: string,
        email: string
    }) {
        return await prisma.patient.create({data: data});
    }

    static async getPatients() {
        return await prisma.patient.findMany({
            select: {
                firstname: true,
                lastname: true,
                birth_date: true,
                phone: true,
                email: true
            }
        });
    }
}