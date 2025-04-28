export interface CreateEventDto {
  taskId: string
  userId: string
  start: Date
  end: Date
}

export interface UpdateEventDto {
  eventId: string
  taskId: string
  userId: string
  start: Date
  end: Date
}
