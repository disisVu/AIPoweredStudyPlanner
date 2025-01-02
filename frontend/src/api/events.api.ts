import { axiosPrivate as api } from '@/api/api'
import { setupInterceptors } from '@/api/apiHeader'
import { CreateEventDto } from '@/types/api/events'
import { Event } from '@/types/schemas/Event'

// Set up the request interceptor
setupInterceptors(api)

const createEvent = async (createEventDto: CreateEventDto): Promise<Event> => {
  try {
    const response = await api.post('/events', createEventDto)
    return response.data
  } catch {
    throw new Error('Error: Create event')
  }
}

const getEventById = async (eventId: string): Promise<Event> => {
  try {
    const response = await api.get(`/events/event/${eventId}`)
    return response.data
  } catch {
    throw new Error('Error: Get event by ID')
  }
}

const getEventsByUserId = async (userId: string): Promise<Event[]> => {
  try {
    const response = await api.get(`/events/user/${userId}`)
    return response.data
  } catch {
    throw new Error('Error: Get events by user ID')
  }
}

const updateEvent = async (eventId: string, updateEventDto: Partial<CreateEventDto>): Promise<Event> => {
  try {
    const response = await api.put(`/events/${eventId}`, updateEventDto)
    return response.data
  } catch {
    throw new Error('Error: Update event')
  }
}

export const eventsApi = { createEvent, getEventById, getEventsByUserId, updateEvent }
