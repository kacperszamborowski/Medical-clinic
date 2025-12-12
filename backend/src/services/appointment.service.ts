import { AppointmentStatus } from "@prisma/client";
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

    static async setAppointmentStatus(appointmentId: number, newStatus: AppointmentStatus) {
        return prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: newStatus }
        }); 
    }

    static async createAppointment(patientId: number, doctorId: number, date: string, time: string) {
        date = (new Date(date)).toISOString();
        time = (new Date("1970-01-01 " + time + " UTC")).toISOString();

        const terms = await prisma.schedule.findMany({
            where: { doctor_id: doctorId },
            select: { 
                day_of_the_week: true,
                hour_from: true,
                hour_to: true
            }
        });

        const checkDay = (() => {
            const d = (new Date(date)).getDay();
            return d === 0 ? 7 : d;
        })();

        const valid = terms.some(term =>
            term.day_of_the_week === checkDay
            && (new Date(term.hour_from)) <= (new Date(time))
            && (new Date(term.hour_to)) > (new Date(time))
        );

        if (!valid) {
            throw new Error("The appointment does not match the doctor's schedule!");
        }

        return prisma.appointment.create({
            data: {
                patient_id: patientId,
                doctor_id: doctorId,
                date: date,
                time: time,
                status: AppointmentStatus.zarezerwowana
            }
        })
    }
}