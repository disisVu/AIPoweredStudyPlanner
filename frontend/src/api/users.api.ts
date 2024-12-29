import { axiosPrivate as api } from '@/api/api'
import { User } from '@/types/schemas/User'
import { FocusTimer } from '@/types/schemas/FocusTimer'
import { getUserCredentials } from '@/utils'

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

const getActiveFocusTimer = async (uid: string): Promise<FocusTimer | null> => {
  try {
    const response = await api.get(`/users/${uid}/active-focus-timer`)
    return response.data
  } catch {
    throw new Error('Error: Get active focus timer')
  }
}

const setActiveFocusTimer = async (uid: string, focusTimerId: string): Promise<User> => {
  try {
    const response = await api.put(`/users/${uid}/active-focus-timer`, { focusTimerId })
    return response.data
  } catch {
    throw new Error('Error: Set active focus timer')
  }
}

const clearActiveFocusTimer = async (uid: string): Promise<User> => {
  try {
    const response = await api.delete(`/users/${uid}/active-focus-timer`)
    return response.data
  } catch {
    throw new Error('Error: Clear active focus timer')
  }
}

export const usersApi = {
  getActiveFocusTimer,
  setActiveFocusTimer,
  clearActiveFocusTimer
}
