import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskGuard } from './task.guard';
import { FilterTasksDto } from './dto/filter-task.dto';
import { Task } from './task.schema';

@Controller('tasks')
@UseGuards(TaskGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':userId')
  getTasks(@Param('userId') userId: string) {
    return this.tasksService.getTasks(userId);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Get('filter/:userId')
  async getFilteredTasks(
    @Param('userId') userId: string,
    @Query() query: FilterTasksDto,
  ) {
    const filters: Partial<Task> = { userId };

    if (query.isDistributed !== undefined) {
      filters.isDistributed = query.isDistributed === 'true';
    }

    if (query.name) {
      filters.name = query.name;
    }

    if (query.priority) {
      filters.priority = query.priority;
    }

    if (query.status) {
      filters.status = query.status;
    }

    if (query.deadline) {
      filters.deadline = query.deadline;
    }

    return await this.tasksService.getFilteredTasks(filters);
  }
}
