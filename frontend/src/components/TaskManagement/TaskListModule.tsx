import { Task } from '@/types/schemas'
import { taskTableColumns, TaskDataTable } from '@/components/TaskManagement'
import { tasksApi } from '@/api/tasks.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

interface TaskListModuleProps {
  tasks: Task[]
}

export function TaskListModule({ tasks }: TaskListModuleProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      toast({
        title: 'Task deleted.',
        description: 'The task has been successfully deleted.'
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting task',
        description: error.message || 'An error occurred while deleting the task.'
      })
    }
  })

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
          exact: false,
          refetchType: 'active'
        })
      }
    })
  }

  return (
    <div className='h-full max-h-full select-none'>
      {tasks && <TaskDataTable columns={taskTableColumns({ handleDeleteTask })} data={tasks} />}
    </div>
  )
}
