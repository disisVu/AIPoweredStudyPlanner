export interface Event {
  _id: string
  taskId: string
  userId: string
  title: string
  start: Date
  end: Date
  isAllDay?: boolean
  isDraggable?: boolean
}
