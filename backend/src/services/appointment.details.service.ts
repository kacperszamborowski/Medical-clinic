import { prisma } from "../db/prisma";

export class AppointmentDetailsService {
    static async createAppointmentDetails(appointmentId: number, diagnosis: string, recommendations: string, prescription: boolean) {
        return await prisma.appointment_details.create({
            data: {
                appointment_id: appointmentId,
                diagnosis: diagnosis,
                recommendations: recommendations,
                prescription: prescription
            }
        });
    }

    static async updateAppointmentDetails(appointmentId: number, diagnosis?: string, recommendations?: string, prescription?: boolean) {
        const updatedDetails: {
            diagnosis?: string,
            recommendations?: string,
            prescription?: boolean
        } = {};

        if (diagnosis != undefined) {
            updatedDetails.diagnosis = diagnosis;
        }

        if (recommendations != undefined) {
            updatedDetails.recommendations = recommendations;
        }

        if (prescription != undefined) {
            updatedDetails.prescription = prescription;
        }

        return await prisma.appointment_details.update({
            where: { appointment_id: appointmentId },
            data: updatedDetails
        });
    }
}