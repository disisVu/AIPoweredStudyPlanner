import { axiosPrivate as api } from '@/api/api'
import { getUserCredentials } from '@/utils'
import { Task } from '@/../../shared/src/schemas/Task'

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

export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/tasks/${userId}`)
    return response.data
  } catch {
    throw new Error('Error: Get tasks by user ID')
  }
}
