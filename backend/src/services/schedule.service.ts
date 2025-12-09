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
}