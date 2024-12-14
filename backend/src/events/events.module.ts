import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '@/events/event.schema';
import { EventsController } from '@/events/events.controller';
import { EventsService } from '@/events/events.service';
import { EventGuard } from '@/events/events.guard';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    AuthModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventGuard],
})
export class EventsModule {}
