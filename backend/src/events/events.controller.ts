import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventGuard } from '@/events/events.guard';
import { EventsService } from '@/events/events.service';
import { CreateEventDto, UpdateEventDto } from '@/events/dto';

@Controller('events')
@UseGuards(EventGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get('event/:eventId')
  getEventById(@Param('eventId') eventId: string) {
    return this.eventsService.getEventById(eventId);
  }

  @Get('user/:userId')
  getEventsByUserId(@Param('userId') userId: string) {
    return this.eventsService.getEventsByUserId(userId);
  }

  @Put(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(eventId, updateEventDto);
  }
}
