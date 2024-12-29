import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task } from '@/types/schemas/Task'

interface TaskState {
  tasks: Task[]
}

const initialState: TaskState = {
  tasks: []
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set tasks array
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    // Add a new task to the array
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
    },
    // Remove a task from the array by ID
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload)
    },
    // Update a task in the array
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task._id === action.payload._id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    // Clear all tasks
    clearTasks: (state) => {
      state.tasks = []
    }
  }
})

export const { setTasks, addTask, removeTask, updateTask, clearTasks } = taskSlice.actions
export default taskSlice.reducer
