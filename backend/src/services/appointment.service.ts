import { prisma } from "../db/prisma";

export class AppointmentService {
    static async getPatientHistory(patientId: number) {
        return await prisma.appointment.findMany({
            where: { patient_id: patientId },
            select: {
                date: true,
                time: true,
                status: true,
                doctor: {
                    select: {
                        specialization: true,
                        user: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        }
                    }
                },
                appointmentDetails: {
                    select: {
                        diagnosis: true,
                        recommendations: true,
                        prescription: true
                    }
                }
            }
        });
    }
}