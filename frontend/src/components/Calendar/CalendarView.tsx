import { useState, useCallback, useMemo, useEffect } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '@/styles/calendarView.scss'

import { CustomToolbar } from '@/components/Calendar'
import { Event } from './event.type'
import { getUserCredentials } from '@/utils'
import { CreateEventRequest } from '../../types/api/events'
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
        console.log(fetchedEvents)

        // Ensure start and end are Date objects
        const formattedEvents = fetchedEvents.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
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
  const dragFromOutsideItem = useCallback((): Event | null => {
    return draggedEvent === 'undroppable' ? null : (draggedEvent ?? null)
  }, [draggedEvent])

  // Custom handling for drag-over events
  const customOnDragOverFromOutside = useCallback(
    (dragEvent: React.DragEvent) => {
      if (draggedEvent !== 'undroppable') {
        dragEvent.preventDefault()
      }
    },
    [draggedEvent]
  )

  // Move an event to a new position
  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<Event>) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev._id === event._id) ?? {}
        const filtered = prev.filter((ev) => ev._id !== event._id)
        return [...filtered, { ...existing, start, end, allDay: droppedOnAllDaySlot }]
      })
    },
    []
  )

  // Handle dropping from outside the calendar
  const onDropFromOutside = useCallback(
    async ({ start, end, allDay }: { start: Date; end: Date; allDay?: boolean }) => {
      console.log('start:', start)

      if (draggedEvent === 'undroppable') {
        setDraggedEvent(undefined)
        return
      }

      const { taskId, title } = draggedEvent as Event
      console.log('taskId: ', taskId)
      console.log('start: ', start)
      console.log('end: ', end)

      // Prepare the event data for the API request
      const eventData: CreateEventRequest = {
        taskId,
        userId: userId!,
        start,
        end
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
            start,
            end,
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
  const resizeEvent = useCallback(({ event, start, end }: EventInteractionArgs<Event>) => {
    setMyEvents((prev) => {
      const existing = prev.find((ev) => ev._id === event._id) ?? {}
      const filtered = prev.filter((ev) => ev._id !== event._id)
      return [...filtered, { ...existing, start, end }]
    })
  }, [])

  // const onEventDrop: withDragAndDropProps<Event>['onEventDrop'] = useCallback(
  //   ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<Event>) => {
  //     const parsedStart = typeof start === 'string' ? new Date(start) : start
  //     const parsedEnd = typeof end === 'string' ? new Date(end) : end

  //     setMyEvents((prevEvents) =>
  //       prevEvents.map((ev) =>
  //         ev.id === event.id ? { ...ev, start: parsedStart, end: parsedEnd, allDay: droppedOnAllDaySlot } : ev
  //       )
  //     )
  //   },
  //   []
  // )

  // const onEventResize: withDragAndDropProps<Event>['onEventResize'] = useCallback(
  //   ({ event, start, end }: EventInteractionArgs<Event>) => {
  //     const parsedStart = typeof start === 'string' ? new Date(start) : start
  //     const parsedEnd = typeof end === 'string' ? new Date(end) : end

  //     setMyEvents((prevEvents) =>
  //       prevEvents.map((ev) => (ev.id === event.id ? { ...ev, start: parsedStart, end: parsedEnd } : ev))
  //     )
  //   },
  //   []
  // )

  // Default date for the calendar
  const { defaultDate } = useMemo(() => ({ defaultDate: new Date() }), [])

  return (
    <div className='ml-6 h-[calc(100vh-88px)] w-full select-none'>
      <DnDCalendar
        style={{ height: '100%' }}
        localizer={localizer}
        defaultDate={defaultDate}
        events={myEvents}
        // onEventDrop={onEventDrop}
        // onEventResize={onEventResize}
        dragFromOutsideItem={dragFromOutsideItem}
        draggableAccessor={(event: Event) => !!event.isDraggable}
        eventPropGetter={eventPropGetter}
        onDropFromOutside={onDropFromOutside}
        onDragOverFromOutside={customOnDragOverFromOutside}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        resizable
        selectable
        components={{ toolbar: CustomToolbar }}
      />
    </div>
  )
}
