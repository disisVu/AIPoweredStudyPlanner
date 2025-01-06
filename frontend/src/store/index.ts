import { configureStore, combineReducers } from '@reduxjs/toolkit'
import taskReducer from '@/store/reducers/taskSlice'
import sessionReducer from '@/store/reducers/sessionSlice'

const rootReducer = combineReducers({
  tasks: taskReducer,
  session: sessionReducer
})

// Create store with default middleware
export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
