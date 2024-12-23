import { axiosPrivate as api } from '@/api/api'
import { getUserCredentials } from '@/utils'
import { Task } from '@/types/schemas/Task'
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from '@/types/api/tasks'

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

const createTask = async (createTaskDto: CreateTaskDto): Promise<Task> => {
  try {
    const response = await api.post('/tasks', createTaskDto)
    return response.data
  } catch {
    throw new Error('Error: Create new task')
  }
}

const updateTask = async (taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> => {
  try {
    const response = await api.patch(`/tasks/${taskId}`, updateTaskDto)
    return response.data
  } catch {
    throw new Error('Error: Edit task')
  }
}

const deleteTask = async (taskId: string) => {
  try {
    await api.delete(`/tasks/${taskId}`)
  } catch {
    throw new Error('Error: Delete task')
  }
}

const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/tasks/${userId}`)
    return response.data
  } catch {
    throw new Error('Error: Get tasks by user ID')
  }
}

const getUndistributedTasksByUserId = async (userId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/tasks/filter/${userId}`, {
      params: {
        isDistributed: false
      }
    })
    return response.data
  } catch {
    throw new Error('Error: Get undistributed tasks by user ID')
  }
}

const getFilteredTasks = async (userId: string, filters: FilterTaskDto) => {
  try {
    // Make the API request with query parameters
    const response = await api.get(`/tasks/filter/${userId}`, {
      params: filters
    })
    return response.data // return filtered tasks
  } catch (error) {
    console.error('Error fetching filtered tasks:', error)
    throw new Error('Error: Unable to fetch filtered tasks')
  }
}

export const tasksApi = {
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
  getUndistributedTasksByUserId,
  getFilteredTasks
}
