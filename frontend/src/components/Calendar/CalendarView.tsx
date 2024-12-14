import { useState, useCallback, useMemo } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '@/styles/calendarView.scss'

import { CustomToolbar } from '@/components/Calendar'
import { eventsMockData } from '@/utils/events'
import { CalendarEvent } from '@/types/components'

// Wrap the Calendar with Drag-and-Drop functionality
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

export function CalendarView() {
  const localizer = momentLocalizer(moment)

  // State to hold the myEvents
  const [myEvents, setMyEvents] = useState(eventsMockData)

  // Handle event drop (when an event is dragged and dropped to a new time slot)
  const onEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'] = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<CalendarEvent>) => {
      const parsedStart = typeof start === 'string' ? new Date(start) : start
      const parsedEnd = typeof end === 'string' ? new Date(end) : end

      setMyEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === event.id ? { ...ev, start: parsedStart, end: parsedEnd, allDay: droppedOnAllDaySlot } : ev
        )
      )
    },
    []
  )

  // Handle event resizing
  const onEventResize: withDragAndDropProps<CalendarEvent>['onEventResize'] = useCallback(
    ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
      const parsedStart = typeof start === 'string' ? new Date(start) : start
      const parsedEnd = typeof end === 'string' ? new Date(end) : end

      setMyEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.id === event.id ? { ...ev, start: parsedStart, end: parsedEnd } : ev))
      )
    },
    []
  )

  // Default date for the calendar
  const { defaultDate } = useMemo(() => ({ defaultDate: new Date() }), [])

  return (
    <div className='ml-6 h-[calc(100vh-88px)] w-full select-none'>
      <DnDCalendar
        style={{ height: '100%' }}
        localizer={localizer}
        defaultDate={defaultDate}
        events={myEvents}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        components={{ toolbar: CustomToolbar }}
      />
    </div>
  )
}
