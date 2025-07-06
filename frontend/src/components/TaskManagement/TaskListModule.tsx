import { Task } from '@/types/schemas'
import { taskTableColumns, TaskDataTable } from '@/components/TaskManagement'
import { tasksApi } from '@/api/services/tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { TaskModal } from '@/components/Modal'
import { setSelectedTask, setTaskModalAction } from '@/store/reducers/taskSlice'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'

interface TaskListModuleProps {
  tasks: Task[]
}

export function TaskListModule({ tasks }: TaskListModuleProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  const taskDeleteMutation = useMutation({
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

  const deleteTask = (taskId: string) => {
    taskDeleteMutation.mutate(taskId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
          exact: false,
          refetchType: 'active'
        })
      }
    })
  }

  function openEditTaskModal(selectedTask: Task) {
    console.log('Selected task:', selectedTask)
    dispatch(setSelectedTask(selectedTask))
    dispatch(setTaskModalAction('update'))
    setModalOpen(true)
  }

  return (
    <div className='h-full max-h-full select-none'>
      {tasks && (
        <TaskDataTable
          columns={taskTableColumns({ openEditTaskModal, deleteTask })}
          data={tasks}
          setModalOpen={setModalOpen}
        />
      )}
      <TaskModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
    </div>
  )
}
