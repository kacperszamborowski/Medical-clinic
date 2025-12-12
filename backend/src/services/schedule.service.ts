import { prisma } from "../db/prisma";

export class ScheduleService {
    static async getSchedule(doctorId: number) {
        const schedule = await prisma.schedule.findMany({
            where: {
                doctor_id: doctorId
            },
            select: {
                id: true,
                day_of_the_week: true,
                hour_from: true,
                hour_to: true,
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
                }
            }
        });

        return schedule.map(s => ({
            id: s.id,
            doctor: `${s.doctor.user.firstname} ${s.doctor.user.lastname}`,
            specialization: s.doctor.specialization,
            day_of_the_week: s.day_of_the_week,
            hour_from: s.hour_from,
            hour_to: s.hour_to,
        }));
    }

    static async createSchedule(doctorId: number, dayOfTheWeek: number, hourFrom: string, hourTo: string) {
        try {
            return await prisma.schedule.create({
                data: {
                    doctor_id: doctorId,
                    day_of_the_week: dayOfTheWeek,
                    hour_from: (new Date("1970-01-01 " + hourFrom + " UTC")).toISOString(),
                    hour_to: (new Date("1970-01-01 " + hourTo + " UTC")).toISOString(),
                }
            });
        }
        catch (error: any) {
            throw error;
        }
    }

    static async updateSchedule(scheduleId: number, doctorId: number, dayOfTheWeek?: number, hourFrom?: string, hourTo?: string) {
        const updatedData: {
            day_of_the_week?: number,
            hour_from?: string,
            hour_to?: string
        } = {};

        if (dayOfTheWeek != undefined) {
            updatedData.day_of_the_week = dayOfTheWeek;
        }
        
        if (hourFrom != undefined) {
            updatedData.hour_from = (new Date("1970-01-01 " + hourFrom + " UTC")).toISOString();
        }

        if (hourTo != undefined) {
            updatedData.hour_to = (new Date("1970-01-01 " + hourTo + " UTC")).toISOString();
        }
        
        return await prisma.schedule.update({
            where: { id: scheduleId },
            data: updatedData
        });
    }

    static async deleteSchedule(scheduleId: number) {
        return await prisma.schedule.delete({
            where: { id: scheduleId }
        });
    }
}