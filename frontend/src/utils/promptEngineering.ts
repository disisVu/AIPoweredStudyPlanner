import { Task } from '@/types/schemas'
import { format } from 'date-fns'

// Function to map task priority and status to human-readable values
export function transformTasks(tasks: Task[]) {
  const priorityMap = { H: 'High', M: 'Medium', L: 'Low' }
  const statusMap = { T: 'Todo', IP: 'In Progress', C: 'Completed', E: 'Expired' }

  return tasks.map((task) => ({
    name: task.name,
    priority: priorityMap[task.priority],
    status: statusMap[task.status],
    deadline: format(new Date(task.deadline), 'yyyy-MM-dd HH:mm')
  }))
}

// Function to build the prompt
export function buildPrompt(tasks: Task[]) {
  const transformedTasks = transformTasks(tasks)
  const taskList = transformedTasks
    .map(
      (task, index) =>
        `${index + 1}. ${task.name} - Priority: ${task.priority}, Status: ${task.status}, Deadline: ${task.deadline}`
    )
    .join('\n')

  return `Analyze this schedule:

    Tasks:
    ${taskList}

    Provide feedback on potential burnout risks and suggest improvements.
  `
}
