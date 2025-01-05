import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FocusTimersService } from './focus-timers.service';
import { FocusTimersController } from './focus-timers.controller';
import { FocusTimer, FocusTimerSchema } from './focus-timers.schema';
import { TasksModule } from '@/tasks/tasks.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FocusTimer.name, schema: FocusTimerSchema },
    ]),
    AuthModule,
    forwardRef(() => TasksModule),
  ],
  providers: [FocusTimersService],
  controllers: [FocusTimersController],
  exports: [FocusTimersService],
})
export class FocusTimersModule {}
