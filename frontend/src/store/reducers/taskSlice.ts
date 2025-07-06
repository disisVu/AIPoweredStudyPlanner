import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task } from '@/types/schemas/Task'

interface TaskState {
  selectedTask: Task | null
  tasks: Task[]
  taskModalAction: 'add' | 'update'
}

const initialState: TaskState = {
  selectedTask: null,
  tasks: [],
  taskModalAction: 'add'
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
    },
    setSelectedTask: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload
    },
    setTaskModalAction: (state, action: PayloadAction<'add' | 'update'>) => {
      state.taskModalAction = action.payload
    }
  }
})

export const { setTasks, addTask, removeTask, updateTask, clearTasks, setSelectedTask, setTaskModalAction } =
  taskSlice.actions
export default taskSlice.reducer
