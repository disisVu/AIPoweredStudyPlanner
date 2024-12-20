import { Task } from '@/types/schemas'
import { taskTableColumns, TaskDataTable } from '@/pages/TaskManagementNew/components'

interface TaskListModuleProps {
  tasks: Task[]
}

export function TaskListModule({ tasks }: TaskListModuleProps) {
  return (
    <div className='h-full select-none'>
      <TaskDataTable columns={taskTableColumns} data={tasks} />
    </div>
  )
}
