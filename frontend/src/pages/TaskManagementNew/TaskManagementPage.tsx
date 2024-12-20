import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TaskFilterModule, TaskListModule } from '@/pages/TaskManagementNew/components'
import { colors } from '@/styles'
import { faCheckCircle, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { Task } from '@/types/schemas'
import { getUserCredentials } from '@/utils'
import { tasksApi } from '@/api/tasks.api'
import { FilterTaskDto } from '@/types/api/tasks'

export function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { uid } = getUserCredentials()

    // If uid is null or not found, stop the process and show an error
    if (!uid) {
      setError('User ID is missing or invalid.')
      return
    }

    // Fetch all tasks when the component first loads
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const fetchedTasks = await tasksApi.getFilteredTasks(uid, {})
        setTasks(fetchedTasks)
      } catch {
        setError('Failed to load tasks.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // This function will be triggered when filters are applied
  const handleFilterChange = async (filters: FilterTaskDto) => {
    const { uid } = getUserCredentials()

    if (!uid) {
      setError('User ID is missing or invalid.')
      return
    }

    try {
      setLoading(true)
      // console.log(filters.deadline)
      const filteredTasks = await tasksApi.getFilteredTasks(uid, filters)
      setTasks(filteredTasks)
    } catch {
      setError('Failed to load filtered tasks.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-[calc(100vh-56px)] w-full justify-center bg-blue-100 px-12 py-8'>
      <div className='grid w-full grid-cols-12 gap-x-4'>
        {/*Task Management Section */}
        <div className='col-span-8 flex flex-col gap-4'>
          <div className='flex items-center gap-x-4' style={{ color: colors.text_primary }}>
            <FontAwesomeIcon icon={faCheckCircle} size='2xl' />
            <span className='text-3xl font-medium'>Task Management</span>
          </div>
          <TaskFilterModule
            onFilterChange={handleFilterChange}
            onClearFilters={() => {
              handleFilterChange({})
            }}
          />
          <div className='h-full max-h-full w-full rounded-xl border border-gray-200 bg-white shadow-sm'>
            <TaskListModule tasks={tasks} />
          </div>
        </div>
        {/*Task Management Section */}
        <div className='col-span-4 flex h-full flex-col gap-4'>
          <div className='flex items-center justify-center'>
            <div className='flex flex-row items-center gap-x-4'>
              <FontAwesomeIcon icon={faLightbulb} size='2xl' />
              <span className='text-3xl font-medium' style={{ color: colors.text_primary }}>
                AI Suggestions
              </span>
            </div>
          </div>
          <div className='h-full rounded-xl border border-gray-200 bg-white shadow-sm'>
            {/* Data Table goes here */}
          </div>
        </div>
      </div>
    </div>
  )
}
