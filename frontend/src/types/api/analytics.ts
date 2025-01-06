export interface TotalTimeResponse {
  total_time_spent: number
  total_estimated_time: number
}

export interface DailyTimeResponse {
  [date: string]: number
}

export interface TaskStatusResponse {
  [status: string]: number
}
