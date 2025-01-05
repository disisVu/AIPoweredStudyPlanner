import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from './task.schema';
import { TaskGuard } from './task.guard';
import { AuthModule } from '@/auth/auth.module';
import { EventsModule } from '@/events/events.module';
import { FocusTimersModule } from '@/focus-timers/focus-timers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AuthModule,
    forwardRef(() => EventsModule),
    forwardRef(() => FocusTimersModule),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskGuard],
  exports: [TasksService],
})
export class TasksModule {}
