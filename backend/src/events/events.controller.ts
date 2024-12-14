import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventGuard } from '@/events/events.guard';
import { EventsService } from '@/events/events.service';
import { CreateEventDto } from '@/events/dto';

@Controller('events')
@UseGuards(EventGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get(':userId')
  getEventsByUserId(@Param('userId') userId: string) {
    return this.eventsService.getEventsByUserId(userId);
  }
}
