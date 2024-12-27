import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SessionState {
  currentEventId: string
  timerIsRunning: boolean
}

const initialState: SessionState = {
  currentEventId: '',
  timerIsRunning: false
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentEventId: (state, action: PayloadAction<string>) => {
      state.currentEventId = action.payload
    },
    setTimerIsRunning: (state, action: PayloadAction<boolean>) => {
      state.timerIsRunning = action.payload
    }
  }
})

export const { setCurrentEventId, setTimerIsRunning } = sessionSlice.actions
export default sessionSlice.reducer
