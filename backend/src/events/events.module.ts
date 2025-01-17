import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '@/events/event.schema';
import { EventsController } from '@/events/events.controller';
import { EventsService } from '@/events/events.service';
import { EventGuard } from '@/events/events.guard';
import { AuthModule } from '@/auth/auth.module';
import { TasksModule } from '@/tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    AuthModule,
    forwardRef(() => TasksModule),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventGuard],
  exports: [EventsService],
})
export class EventsModule {}
