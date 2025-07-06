import { useState, useCallback, useMemo } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import '@/styles/calendarView.scss'

import { CustomToolbar } from '@/components/Calendar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Event } from './event.type'
import { Event as ZodEvent } from '@/types/schemas'
import { convertToDate, getUserCredentials } from '@/utils'
import { CreateEventDto, UpdateEventDto } from '@/types/api/events'
import { eventsApi } from '@/api/services/events'
import { FocusTimerModal } from '@/components/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { setCurrentEventId } from '@/store/reducers/sessionSlice'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const DnDCalendar = withDragAndDrop<Event>(Calendar)

interface CalendarViewProps {
  draggedEvent: Event | 'undroppable' | undefined
  setDraggedEvent: React.Dispatch<React.SetStateAction<Event | 'undroppable' | undefined>>
}

export function CalendarView({ draggedEvent, setDraggedEvent }: CalendarViewProps) {
  const queryClient = useQueryClient()
  const { uid } = getUserCredentials()
  const localizer = momentLocalizer(moment)
  const [myEvents, setMyEvents] = useState<Event[]>([])

  useQuery({
    queryKey: ['events', uid],
    queryFn: async () => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      const data = await eventsApi.getEventsByUserId(uid)
      const formattedEvents = data.map((event: ZodEvent) => ({
        ...event,
        _id: event._id ?? '',
        start: new Date(event.start),
        end: new Date(event.end),
        isDraggable: true,
        isAllDay: false
      }))
      setMyEvents(formattedEvents)
      return data
    },
    enabled: !!uid
  })

  const eventCreateMutation = useMutation({
    mutationKey: ['createEvent'],
    mutationFn: async (data: CreateEventDto) => {
      const createdEvent = await eventsApi.createEvent(data as CreateEventDto)
      return createdEvent
    }
  })

  const eventUpdateMutation = useMutation({
    mutationKey: ['updateEvent'],
    mutationFn: async (data: UpdateEventDto) => {
      const { eventId, ...updateData } = data
      if (!eventId) {
        throw new Error('Event ID is missing for update action.')
      }
      const updatedEvent = await eventsApi.updateEvent(eventId, updateData as UpdateEventDto)
      return updatedEvent
    }
  })

  // Event property customization for draggable events
  const eventPropGetter = useCallback(
    (event: Event) => ({
      ...(event.isDraggable ? { className: 'isDraggable' } : { className: 'nonDraggable' })
    }),
    []
  )

  // Provide the dragged event from outside
  const dragFromOutsideItem = useCallback((): keyof Event | ((event: Event) => Date) => {
    return 'start'
  }, [])

  // Handle dropping from outside the calendar
  const onDropFromOutside = useCallback(
    async ({ start, end, allDay }: { start: string | Date; end: string | Date; allDay?: boolean }) => {
      if (draggedEvent === 'undroppable') {
        setDraggedEvent(undefined)
        return
      }

      const { taskId } = draggedEvent as Event

      eventCreateMutation.mutate(
        {
          taskId,
          userId: uid!,
          start: convertToDate(start),
          end: convertToDate(end)
        } as CreateEventDto,
        {
          onSuccess: (createdEvent) => {
            try {
              // Update the local state with the newly created event
              setMyEvents((prev) => [
                ...prev,
                {
                  _id: createdEvent._id,
                  taskId: createdEvent.taskId,
                  userId: uid!,
                  title: createdEvent.title,
                  start: new Date(createdEvent.start),
                  end: new Date(createdEvent.end),
                  isAllDay: allDay || false,
                  isDraggable: true
                } as Event
              ])
              // Update undistributed tasks list in Task Panel (drag source)
              queryClient.invalidateQueries({
                queryKey: ['tasks', uid, 'undistributed'],
                exact: true,
                refetchType: 'active'
              })
            } catch (error) {
              console.error('Failed to create event:', error)
            } finally {
              // Reset the dragged event regardless of success or failure
              setDraggedEvent(undefined)
            }
          }
        }
      )
    },
    [eventCreateMutation, draggedEvent, queryClient, setDraggedEvent, uid]
  )

  // Move an event to a new position
  const moveEvent = useCallback(
    async ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<Event>) => {
      // Update the event on the server
      eventUpdateMutation.mutate(
        {
          eventId: event._id,
          start: convertToDate(start),
          end: convertToDate(end)
        } as UpdateEventDto,
        {
          onSuccess: () => {
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
          }
        }
      )
    },
    [eventUpdateMutation]
  )

  // Resize an event
  const resizeEvent = useCallback(
    async ({ event, start, end }: EventInteractionArgs<Event>) => {
      eventUpdateMutation.mutate(
        {
          eventId: event._id,
          start: convertToDate(start),
          end: convertToDate(end)
        } as UpdateEventDto,
        {
          onSuccess: () => {
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
          }
        }
      )
    },
    [eventUpdateMutation]
  )

  // Default date for the calendar
  const { defaultDate } = useMemo(() => ({ defaultDate: new Date() }), [])

  const dispatch = useDispatch<AppDispatch>()
  const currentEventId = useSelector((state: RootState) => state.session.currentEventId)
  const timerIsRunning = useSelector((state: RootState) => state.session.timerIsRunning)

  const handleSelectEvent = (event: Event) => {
    dispatch(setCurrentEventId(event._id))
  }

  const handleOpenChange = () => {
    if (!timerIsRunning) {
      dispatch(setCurrentEventId(''))
    }
  }

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
        onSelectEvent={handleSelectEvent}
      />
      <Dialog open={currentEventId !== '' || timerIsRunning} onOpenChange={handleOpenChange}>
        <DialogContent className='min-w-fit focus:outline-none [&>button]:hidden'>
          <FocusTimerModal />
        </DialogContent>
      </Dialog>
    </div>
  )
}
