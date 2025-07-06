import { AxiosInstance } from 'axios'
import { getUserCredentials } from '@/utils'

export const setupInterceptors = (api: AxiosInstance) => {
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
}
