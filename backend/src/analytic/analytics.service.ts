import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FocusTimer } from '@/focus-timers/focus-timers.schema';
import { Task } from '@/tasks/task.schema';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel(FocusTimer.name) private readonly focusTimerModel: Model<FocusTimer>,
        @InjectModel(Task.name) private readonly taskModel: Model<Task>
    ) { }

    async getTotalTime(userId: string): Promise<any> {
        const focusTime = await this.focusTimerModel.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total_time: { $sum: "$timeSpent" } } }
        ]);

        const estimatedTime = await this.taskModel.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total_estimated: { $sum: "$estimatedTime" } } }
        ]);

        return {
            total_time_spent: focusTime[0]?.total_time || 0,
            total_estimated_time: estimatedTime[0]?.total_estimated || 0
        };
    }

    async getDailyTime(userId: string): Promise<any> {
        const dailyTime = await this.focusTimerModel.aggregate([
            { $match: { userId } },
            {
                $project: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    timeSpent: 1
                }
            },
            {
                $group: {
                    _id: "$day",
                    totalTimeSpent: { $sum: "$timeSpent" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return dailyTime.reduce((acc, item) => {
            acc[item._id] = item.totalTimeSpent;
            return acc;
        }, {});
    }

    async getTaskStatus(userId: string): Promise<any> {
        const taskStatus = await this.taskModel.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const statusMap = { T: "T", IP: "IP", C: "C", E: "E" };
        const defaultStatusCounts = {
            T: 0,
            IP: 0,
            C: 0,
            E: 0,
        };
        return taskStatus.reduce((acc, item) => {
            const key = statusMap[item._id];
            if (key) {
                acc[key] = item.count;
            }
            return acc;
        }, defaultStatusCounts);
    }
}
