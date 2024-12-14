import { useState, useEffect } from 'react'
import { colors } from '@/styles'
import { Task } from '@/../../shared/src/schemas/Task'
import { getTasksByUserId } from '@/api/tasks.api'
import { getUserCredentials } from '@/utils'

export function TaskPanel() {
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
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className='w-60 px-6 py-4' style={{ color: colors.text_primary }}>
      <div className='flex h-10 items-center justify-start'>
        <span className='font-medium'>Tasks</span>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      <ul className='space-y-2'>
        {tasks.map((task) => (
          <li key={task._id} className='border-b pb-2'>
            <div className='font-medium'>{task.name}</div>
            <div className='text-sm text-gray-500'>{task.description}</div>
            <div className='text-xs text-gray-400'>
              Priority: {task.priority}, Status: {task.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
