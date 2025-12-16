import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../db/prisma";

export class AppointmentService {
    static async getAppointment(appointmentId: number) {
        return await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });
    }

    static async getBusyHours(doctorId: number, date: string) {
        return await prisma.appointment.findMany({
            where: { 
                doctor_id: doctorId,
                date: (new Date(date)).toISOString(),
                NOT: { status: AppointmentStatus.odwołana } 
            },
            select: {
                time: true
            }
        });
    }

    static async getPatientHistory(patientId: number) {
        const appointments =  await prisma.appointment.findMany({
            where: { patient_id: patientId },
            select: {
                id: true,
                date: true,
                time: true,
                status: true,
                cancel_reason: true,
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
        
        return appointments.map(a => ({
            id: a.id,
            date: a.date,
            time: a.time,
            doctor: `${a.doctor.user.firstname} ${a.doctor.user.lastname}`,
            specialization: a.doctor.specialization,
            status: a.status,
            cancelReason: a.cancel_reason,
            details: a.appointmentDetails
        }));
    }

    static async doesPatientHaveAppointment(patientId: number, doctorId: number, date: string) {
        const appointments = await prisma.appointment.findMany({
            where: {
                patient_id: patientId,
                doctor_id: doctorId,
                date: (new Date(date)).toISOString(),
            }
        });

        return appointments.length > 0;
    }

    static async getDoctorFinishedAppointments(doctorId: number) {
        const appointments =  await prisma.appointment.findMany({
            where: { 
                doctor_id: doctorId,
                OR: [
                    { status: "zrealizowana" },
                    { status: "odwołana" }
                ]
            },
            select: {
                id: true,
                date: true,
                time: true,
                status: true,
                patient: {
                    select: {
                        firstname: true,
                        lastname: true
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
        return appointments.map(a => ({
            id: a.id,
            date: a.date,
            time: a.time,
            patient: `${a.patient.firstname} ${a.patient.lastname}`,
            status: a.status,
            details: a.appointmentDetails
        }));
    }

    static async getDoctorAppointmentsByStatus(doctorId: number, status: AppointmentStatus) {
        const appointments =  await prisma.appointment.findMany({
            where: { 
                doctor_id: doctorId,
                status: status 
            },
            select: {
                id: true,
                date: true,
                time: true,
                status: true,
                patient: {
                    select: {
                        firstname: true,
                        lastname: true
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
        
        return appointments.map(a => ({
            id: a.id,
            date: a.date,
            time: a.time,
            patient: `${a.patient.firstname} ${a.patient.lastname}`,
            status: a.status,
            details: a.appointmentDetails
        }));
    }

    static async setAppointmentStatus(appointmentId: number, newStatus: AppointmentStatus, cancelReason?: string) {
        const updatedData: {
            status: AppointmentStatus,
            cancel_reason?: string
        } = { status: newStatus };
        
        if (newStatus === AppointmentStatus.odwołana && cancelReason != undefined) {
            updatedData.cancel_reason = cancelReason;
        }

        return prisma.appointment.update({
            where: { id: appointmentId },
            data: updatedData
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

        const currentAppointments = await prisma.appointment.findMany({
            where: { doctor_id: doctorId },
            select: {
                date: true,
                time: true,
                status: true
            }
        });

        const free = currentAppointments.some(a => {
            if (a.date.toISOString() === date
                && a.time.toISOString() === time
                && a.status != AppointmentStatus.odwołana) {
                return false;
            }
            return true;
        });

        if (!free) {
            throw new Error("This term is already taken!");
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