import { axiosPrivate as api } from '@/api/api'
import { getUserCredentials } from '@/utils'
import { CreateEventRequest } from '@/types/api/events'
import { Event } from '@/../../shared/src/schemas/Event'

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

const createEvent = async (eventData: CreateEventRequest): Promise<Event> => {
  try {
    const response = await api.post('/events', eventData)
    return response.data
  } catch {
    throw new Error('Error: Create event')
  }
}

const getEventsByUserId = async (userId: string): Promise<Event[]> => {
  try {
    const response = await api.get(`/events/${userId}`)
    return response.data
  } catch {
    throw new Error('Error: Get events by user ID')
  }
}

const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<Event> => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData)
    return response.data
  } catch {
    throw new Error('Error: Update event')
  }
}

export const eventsApi = { createEvent, getEventsByUserId, updateEvent }
