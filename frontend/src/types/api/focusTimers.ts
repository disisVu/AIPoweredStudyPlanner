export interface CreateFocusTimerDto {
  userId: string
  taskId: string
  eventId: string
  focusDuration: number
  breakDuration: number
  remainingTime: number
  timeSpent: number
  isActive: boolean
}
