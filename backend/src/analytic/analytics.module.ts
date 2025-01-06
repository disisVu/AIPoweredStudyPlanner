import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import {
  FocusTimer,
  FocusTimerSchema,
} from '@/focus-timers/focus-timers.schema';
import { Task, TaskSchema } from '@/tasks/task.schema';
import { AnalyticGuard } from './analytics.guard';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FocusTimer.name, schema: FocusTimerSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    AuthModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticGuard],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
