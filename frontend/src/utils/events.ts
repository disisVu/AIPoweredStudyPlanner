import { Task } from '@/../../shared/src/schemas/Task'
import { Event } from '@/../../shared/src/schemas/Event'
import { events, tasks } from '@/resources/events'
import { CalendarEvent } from '@/types/components'

export function mapToCalendarEvents(events: Event[], tasks: Task[]): CalendarEvent[] {
  return events
    .map((event) => {
      const task = tasks.find((task) => task._id === event.task_id)
      if (!task) {
        console.error(`Task not found for task_id: ${event.task_id}`)
        return null // Skip event if the associated task is missing
      }
      return {
        id: event._id,
        title: task.name,
        start: new Date(event.start_time),
        end: new Date(event.end_time)
      }
    })
    .filter((event): event is NonNullable<typeof event> => event !== null)
}

export const eventsMockData = mapToCalendarEvents(events, tasks)
