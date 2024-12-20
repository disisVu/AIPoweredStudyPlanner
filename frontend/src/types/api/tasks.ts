export interface CreateTaskDto {
  userId: string
  name: string
  description: string
  priority: 'H' | 'M' | 'L'
  status: 'T' | 'IP' | 'C' | 'E'
  estimatedTime: number
  deadline: Date
  isDistributed: boolean
}

export interface FilterTaskDto {
  name?: string
  priority?: 'H' | 'M' | 'L'
  status?: 'T' | 'IP' | 'C' | 'E'
  deadline?: Date
  isDistributed?: boolean
}
