import { Task } from '@/types/schemas'
import { taskTableColumns, TaskDataTable } from '@/components/TaskManagement'
import { useDispatch } from 'react-redux'
import { removeTask } from '@/store/reducers/taskSlice'
import { tasksApi } from '@/api/tasks.api'

interface TaskListModuleProps {
  tasks: Task[]
}

export function TaskListModule({ tasks }: TaskListModuleProps) {
  const dispatch = useDispatch()

  // Define the delete handler
  const handleDeleteTask = async (taskId: string) => {
    await tasksApi.deleteTask(taskId)
    dispatch(removeTask(taskId))
  }

  return (
    <div className='h-full max-h-full select-none'>
      <TaskDataTable columns={taskTableColumns({ handleDeleteTask })} data={tasks} />
    </div>
  )
}
