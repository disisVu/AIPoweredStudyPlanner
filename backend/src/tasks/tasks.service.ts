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
    return await this.taskModel.find(filters).exec();
  }
}
