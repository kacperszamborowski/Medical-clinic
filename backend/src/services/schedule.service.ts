import { prisma } from "../db/prisma";

export class ScheduleService {
    static async getSchedule(doctorId: number) {
        return await prisma.schedule.findMany({
            where: {
                doctor_id: doctorId
            },
            select: {
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
    }

    static async createSchedule(doctorId: number, dayOfTheWeek: number, hourFrom: string, hourTo: string) {
        console.log("SERVICE: " + hourFrom + " " + hourTo);
        return await prisma.schedule.create({
            data: {
                doctor_id: doctorId,
                day_of_the_week: dayOfTheWeek,
                hour_from: (new Date("1970-01-01 " + hourFrom + " UTC")).toISOString(),
                hour_to: (new Date("1970-01-01 " + hourTo + " UTC")).toISOString(),
            }
        })
    }
}