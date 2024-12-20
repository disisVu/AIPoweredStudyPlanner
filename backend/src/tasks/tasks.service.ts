import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const newTask = new this.taskModel(createTaskDto);
    await newTask.save();
    return newTask;
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, {
      new: true,
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(taskId);
    if (!result) throw new NotFoundException('Task not found');
  }

  async getTaskById(taskId: string): Promise<Task> {
    return await this.taskModel.findById(taskId).exec();
  }

  async getFilteredTasks(filters: Partial<Task>): Promise<Task[]> {
    const query: any = { ...filters };

    // If there's a name filter, apply regex for case-insensitive matching
    if (filters.name) {
      query.name = { $regex: new RegExp(filters.name, 'i') }; // 'i' for case-insensitive match
    }

    // If there's a deadline filter, handle it as an exact date match (ignoring the time)
    if (filters.deadline) {
      const deadlineDate = new Date(filters.deadline);

      // Check if the deadline is a valid date
      if (!isNaN(deadlineDate.getTime())) {
        // Normalize the deadline to ignore time by setting hours, minutes, seconds, and milliseconds to 0
        const startOfDay = new Date(deadlineDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(deadlineDate.setHours(23, 59, 59, 999));

        query.deadline = {
          $gte: startOfDay, // Start of the day (00:00:00)
          $lt: endOfDay, // End of the day (23:59:59)
        };
      }
    }

    // Perform the query with filters
    return await this.taskModel.find(query).exec();
  }
}
