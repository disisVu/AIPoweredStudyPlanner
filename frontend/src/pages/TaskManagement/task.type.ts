// Define a type for Task
//   H: High
//   M: Medium
//   L: Low
// T: Todo
// IP: In Progress
// C: Completed
// E: Expired
export interface Task {
  id: string
  name: string
  description: string
  priority: 'H' | 'M' | 'L'
  status: 'T' | 'IP' | 'C'
  estimatedTime: number // minutes
  deadline: string
  isDistributed: false
}
