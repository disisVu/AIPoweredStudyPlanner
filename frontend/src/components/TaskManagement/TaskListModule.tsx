import { Task } from '@/types/schemas'
import { taskTableColumns, TaskDataTable } from '@/components/TaskManagement'
import { tasksApi } from '@/api/tasks.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { TaskModal } from '../Modal'
import { useState } from 'react'

interface TaskListModuleProps {
  tasks: Task[]
}

export function TaskListModule({ tasks }: TaskListModuleProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (task: Task) => {
    console.log('Selected Task:', task)
    console.log(isModalOpen, isModalOpen)
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTask(null)
    setIsModalOpen(false)
  }

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
      {tasks && <TaskDataTable columns={taskTableColumns({ openModal, handleDeleteTask })} data={tasks} />}

      {/* Render the TaskModal outside the table */}
      {isModalOpen && selectedTask && (
        <TaskModal action='update' initialTask={selectedTask} onClose={closeModal} triggerComponent={null} />
      )}
    </div>
  )
}
