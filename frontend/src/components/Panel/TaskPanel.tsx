import { useState, useEffect, useCallback } from 'react'
import { colors } from '@/styles'
import { Task } from '@/../../shared/src/schemas/Task'
import { getTasksByUserId } from '@/api/tasks.api'
import { getTextColorForBackground, getUserCredentials, stringToColor } from '@/utils'
import { Event } from '@/components/Calendar/event.type'

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
        const fetchedTasks = await getTasksByUserId(uid)
        console.log(fetchedTasks)
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
    <div className='w-60 px-6 py-4' style={{ color: colors.text_primary }}>
      <div className='mb-4 flex h-10 items-center justify-start'>
        <span className='font-medium'>Tasks</span>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      <ul className='space-y-2'>
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
  const bgColor = stringToColor(task._id!)
  return (
    <div
      draggable='true'
      className='flex w-full items-center justify-start rounded-lg px-4 py-2'
      style={{ backgroundColor: bgColor }}
      onDragStart={() => onDragStart()}
    >
      <span className='text-sm font-medium' style={{ color: getTextColorForBackground(bgColor) }}>
        {task.name}
      </span>
    </div>
  )
}
