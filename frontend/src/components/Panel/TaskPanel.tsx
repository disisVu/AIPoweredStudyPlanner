import { useState, useEffect, useCallback } from 'react'
import { colors, priorityColors, statusColors } from '@/styles'
import { Task } from '@/types/schemas/Task'
import { tasksApi } from '@/api/tasks.api'
import { formatDate, getUserCredentials } from '@/utils'
import { TaskBadge } from '@/components/Badge'
import { Event } from '@/components/Calendar/event.type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'

interface TaskPanelProps {
  setDraggedEvent: React.Dispatch<React.SetStateAction<Event | 'undroppable' | undefined>>
}

export function TaskPanel({ setDraggedEvent }: TaskPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks by user ID
  useEffect(() => {
    const { uid } = getUserCredentials()

    // If uid is null or not found, stop the process and show an error
    if (!uid) {
      setError('User ID is missing or invalid.')
      return
    }

    const fetchTasks = async () => {
      try {
        setLoading(true)
        const fetchedTasks = await tasksApi.getUndistributedTasksByUserId(uid)
        setTasks(fetchedTasks)
      } catch {
        setError('Failed to load tasks.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

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

      {loading && <p>Loading tasks...</p>}
      {error && <p className='text-red-500'>{error}</p>}

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
