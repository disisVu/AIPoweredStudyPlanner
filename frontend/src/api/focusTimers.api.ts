import { axiosPrivate as api } from '@/api/api'
import { getUserCredentials } from '@/utils'
import { CreateFocusTimerDto } from '@/types/api/focusTimers'
import { FocusTimer } from '@/types/schemas/FocusTimer'

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

const createFocusTimer = async (createFocusTimerDto: CreateFocusTimerDto): Promise<FocusTimer> => {
  try {
    const response = await api.post('/focus-timers', createFocusTimerDto)
    return response.data
  } catch {
    throw new Error('Error: Create focus timer')
  }
}

const getFocusTimerById = async (focusTimerId: string): Promise<FocusTimer> => {
  try {
    const response = await api.get(`/focus-timers/timer/${focusTimerId}`)
    return response.data
  } catch {
    throw new Error('Error: Get focus timer by ID')
  }
}

const getFocusTimersByUserId = async (userId: string): Promise<FocusTimer[]> => {
  try {
    const response = await api.get(`/focus-timers/user/${userId}`)
    return response.data
  } catch {
    throw new Error('Error: Get focus timers by user ID')
  }
}

const getFocusTimerByTaskId = async (taskId: string): Promise<FocusTimer> => {
  try {
    const response = await api.get(`/focus-timers/task/${taskId}`)
    return response.data
  } catch {
    throw new Error('Error: Get focus timer by task ID')
  }
}

const updateFocusTimer = async (
  focusTimerId: string,
  updateFocusTimerDto: Partial<CreateFocusTimerDto>
): Promise<FocusTimer> => {
  try {
    const response = await api.put(`/focus-timers/${focusTimerId}`, updateFocusTimerDto)
    return response.data
  } catch {
    throw new Error('Error: Update focus timer')
  }
}

export const focusTimersApi = {
  createFocusTimer,
  getFocusTimerById,
  getFocusTimersByUserId,
  getFocusTimerByTaskId,
  updateFocusTimer
}