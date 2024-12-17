import { Event } from '@/../../shared/src/schemas/Event'

export type CalendarEvent = Omit<Event, 'start_time' | 'end_time'> & {
  id: string
  name: string
  start: Date
  end: Date
  allDay?: boolean
  isDraggable?: boolean
}

export type DragAndDropEventArgs<CalendarEvent> = {
  event: CalendarEvent
  start: Date
  end: Date
  isAllDay?: boolean
  isDraggable?: boolean
}
