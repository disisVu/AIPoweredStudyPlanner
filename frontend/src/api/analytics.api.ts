import { axiosPrivate as api } from '@/api/api'
import { setupInterceptors } from '@/api/apiHeader'
import { TotalTimeResponse, DailyTimeResponse, TaskStatusResponse } from '@/types/api/analytics'

// Set up the request interceptor
setupInterceptors(api)

const getTotalTime = async (userId: string, token: string): Promise<TotalTimeResponse> => {
  try {
    const response = await api.get<TotalTimeResponse>(`/analytics/total-time/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch {
    throw new Error('Error: Get total time')
  }
}

const getDailyTime = async (userId: string, token: string): Promise<DailyTimeResponse> => {
  try {
    const response = await api.get<DailyTimeResponse>(`/analytics/daily-time/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch {
    throw new Error('Error: Get daily time')
  }
}

const getTaskStatus = async (userId: string, token: string): Promise<TaskStatusResponse> => {
  try {
    const response = await api.get<TaskStatusResponse>(`/analytics/task-status/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch {
    throw new Error('Error: Get task status')
  }
}

export const analyticsApi = { getTotalTime, getDailyTime, getTaskStatus }
