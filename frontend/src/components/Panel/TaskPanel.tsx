import { useCallback } from 'react'
import { colors, priorityColors, statusColors } from '@/styles'
import { Task } from '@/types/schemas/Task'
import { tasksApi } from '@/api/services/tasks'
import { formatDate, getUserCredentials } from '@/utils'
import { TaskBadge } from '@/components/Badge'
import { Event } from '@/components/Calendar/event.type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'
import { useQuery } from '@tanstack/react-query'

interface TaskPanelProps {
  setDraggedEvent: React.Dispatch<React.SetStateAction<Event | 'undroppable' | undefined>>
}

export function TaskPanel({ setDraggedEvent }: TaskPanelProps) {
  const { uid } = getUserCredentials()

  const {
    isLoading,
    isError,
    data: tasks = []
  } = useQuery({
    queryKey: ['tasks', uid, 'undistributed'],
    queryFn: async () => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      const data = await tasksApi.getUndistributedTasksByUserId(uid)
      return data
    }
  })

  // Handle drag start and set the dragged event
  const handleDragStart = useCallback(
    (event: Event | 'undroppable') => {
      setDraggedEvent(event)
    },
    [setDraggedEvent]
  )

  return (
    <div
      className='w-72 overflow-y-auto px-6 py-4'
      style={{ maxHeight: 'calc(100vh - 56px)', color: colors.text_secondary }}
    >
      <div className='mb-4 flex h-10 items-center justify-start gap-3'>
        <FontAwesomeIcon icon={faCircleCheck} size='lg' style={{ paddingBottom: '2px' }} />
        <span className='text-md font-semibold'>Undistributed Tasks</span>
      </div>

      {isLoading && <p>Fetching tasks...</p>}
      {isError && <p className='text-red-500'>Failed to fetch tasks.</p>}

      <ul className='space-y-3'>
        {tasks.map((task) => (
          <DraggableTask
            key={task._id}
            task={task}
            onDragStart={() => handleDragStart({ title: task.name, taskId: task._id } as Event)}
          />
        ))}
      </ul>
    </div>
  )
}

interface DraggableTaskProps {
  task: Task
  onDragStart: () => void
}

function DraggableTask({ task, onDragStart }: DraggableTaskProps) {
  return (
    <div
      draggable='true'
      className='flex w-full cursor-grab flex-col items-start justify-start gap-3 rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 shadow-sm'
      style={{ color: colors.text_primary }}
      onDragStart={() => onDragStart()}
    >
      <div className='flex flex-row gap-2'>
        <TaskBadge
          label={taskPriorityLabels[task.priority]}
          textColor={priorityColors[task.priority].textColor}
          bgColor={priorityColors[task.priority].bgColor}
        />
        <TaskBadge
          label={taskStatusLabels[task.status]}
          textColor={statusColors[task.status].textColor}
          bgColor={statusColors[task.status].bgColor}
        />
      </div>
      <span className='line-clamp-2 text-start text-sm font-medium'>{task.name}</span>
      <div className='flex flex-row gap-2 font-medium' style={{ color: colors.text_secondary }}>
        <FontAwesomeIcon icon={faCalendar} />
        <span className='text-sm'>Due on {formatDate(task.deadline)}</span>
      </div>
    </div>
  )
}
