import { useState, useCallback, useMemo, useEffect } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '@/styles/calendarView.scss'

import { CustomToolbar } from '@/components/Calendar'
import { Event } from './event.type'
import { Event as ZodEvent } from '@/types/schemas'
import { convertToDate, getUserCredentials } from '@/utils'
import { CreateEventRequest } from '@/types/api/events'
import { eventsApi } from '@/api/events.api'

const DnDCalendar = withDragAndDrop<Event>(Calendar)

interface CalendarViewProps {
  draggedEvent: Event | 'undroppable' | undefined
  setDraggedEvent: React.Dispatch<React.SetStateAction<Event | 'undroppable' | undefined>>
}

export function CalendarView({ draggedEvent, setDraggedEvent }: CalendarViewProps) {
  // Get user ID
  const [userId, setUserId] = useState<string | null>()

  useEffect(() => {
    if (!userId) {
      const { uid } = getUserCredentials()
      console.log(uid)
      setUserId(uid)
    }
  }, [userId])

  const localizer = momentLocalizer(moment)

  // State to hold the myEvents
  const [myEvents, setMyEvents] = useState<Event[]>([])

  useEffect(() => {
    if (!userId) {
      console.log('User ID is missing or invalid.')
      return
    }

    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventsApi.getEventsByUserId(userId)

        // Ensure start and end are Date objects
        const formattedEvents = fetchedEvents.map((event: ZodEvent) => ({
          ...event,
          _id: event._id ?? '',
          start: new Date(event.start),
          end: new Date(event.end),
          isDraggable: true,
          isAllDay: false
        }))

        setMyEvents(formattedEvents)
      } catch {
        console.log('Failed to fetch events.')
      }
    }

    fetchEvents()
  }, [userId])

  // Event property customization for draggable events
  const eventPropGetter = useCallback(
    (event: Event) => ({
      ...(event.isDraggable ? { className: 'isDraggable' } : { className: 'nonDraggable' })
    }),
    []
  )

  // Provide the dragged event from outside
  const dragFromOutsideItem = useCallback((): keyof Event | ((event: Event) => Date) => {
    // if (draggedEvent === 'undroppable') {
    //   return undefined
    // }

    // Option 1: Return a key like 'start' or 'end'
    return 'start'
  }, [])

  // Custom handling for drag-over events
  // const customOnDragOverFromOutside = useCallback(
  //   (dragEvent: React.DragEvent) => {
  //     if (draggedEvent !== 'undroppable') {
  //       dragEvent.preventDefault()
  //     }
  //   },
  //   [draggedEvent]
  // )

  // Move an event to a new position
  const moveEvent = useCallback(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<Event>) => {
      try {
        // Update the event on the server
        await eventsApi.updateEvent(event._id, {
          start: convertToDate(start),
          end: convertToDate(end)
        })

        // Update the state
        setMyEvents((prev) => {
          // Find the existing event in the state
          const existing = prev.find((ev) => ev._id === event._id)

          // If the event doesn't exist in the state, return the previous state unchanged
          if (!existing) return prev

          // Create a new event object with the updated fields
          const updatedEvent = {
            ...existing,
            start: convertToDate(start),
            end: convertToDate(end),
            isAllDay: droppedOnAllDaySlot
          }

          // Remove the old event and add the updated event
          const filtered = prev.filter((ev) => ev._id !== event._id)
          return [...filtered, updatedEvent]
        })
      } catch (error) {
        console.error('Failed to update event:', error)
      }
    },
    []
  )

  // Handle dropping from outside the calendar
  const onDropFromOutside = useCallback(
    async ({ start, end, allDay }: { start: string | Date; end: string | Date; allDay?: boolean }) => {
      if (draggedEvent === 'undroppable') {
        setDraggedEvent(undefined)
        return
      }

      const { taskId, title } = draggedEvent as Event

      // Ensure that start and end are Date objects
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Prepare the event data for the API request
      const eventData: CreateEventRequest = {
        taskId,
        userId: userId!,
        start: startDate,
        end: endDate
      }

      try {
        // Call the API to create the event
        const createdEvent = await eventsApi.createEvent(eventData)

        // Update the local state with the newly created event
        setMyEvents((prev) => [
          ...prev,
          {
            _id: createdEvent._id,
            taskId,
            userId: userId!,
            title,
            start: startDate,
            end: endDate,
            isAllDay: allDay || false,
            isDraggable: true
          } as Event
        ])
      } catch (error) {
        console.error('Failed to create event:', error)
      } finally {
        // Reset the dragged event regardless of success or failure
        setDraggedEvent(undefined)
      }
    },
    [draggedEvent, setDraggedEvent, userId]
  )

  // Resize an event
  const resizeEvent = useCallback(async ({ event, start, end }: EventInteractionArgs<Event>) => {
    try {
      // Update the event on the server
      await eventsApi.updateEvent(event._id, {
        start: convertToDate(start),
        end: convertToDate(end)
      })

      // Update the state
      setMyEvents((prev) => {
        // Find the existing event in the state
        const existing = prev.find((ev) => ev._id === event._id)

        // If the event doesn't exist, just return the previous state unchanged
        if (!existing) return prev

        // Update the existing event with new start and end values
        const updatedEvent = {
          ...existing,
          start: convertToDate(start),
          end: convertToDate(end)
        }

        // Filter out the old event and return the updated event
        const filtered = prev.filter((ev) => ev._id !== event._id)
        return [...filtered, updatedEvent]
      })
    } catch (error) {
      console.error('Failed to update event:', error)
    }
  }, [])

  // Default date for the calendar
  const { defaultDate } = useMemo(() => ({ defaultDate: new Date() }), [])

  return (
    <div className='ml-6 h-[calc(100vh-88px)] w-full select-none'>
      <DnDCalendar
        style={{ height: '100%' }}
        localizer={localizer}
        defaultDate={defaultDate}
        events={myEvents}
        dragFromOutsideItem={dragFromOutsideItem}
        draggableAccessor={(event: Event) => !!event.isDraggable}
        eventPropGetter={eventPropGetter}
        onDropFromOutside={onDropFromOutside}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        resizable
        selectable
        components={{ toolbar: CustomToolbar }}
      />
    </div>
  )
}
