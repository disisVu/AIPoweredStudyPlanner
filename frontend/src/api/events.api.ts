import { axiosPrivate as api } from '@/api/api'
import { getUserCredentials } from '@/utils'
import { CreateEventDto } from '@/types/api/events'
import { Event } from '@/types/schemas/Event'

// Set up a request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      // Get user credentials
      const { accessToken } = getUserCredentials()
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
    } catch {
      console.log('Error: empty user credentials.')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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
