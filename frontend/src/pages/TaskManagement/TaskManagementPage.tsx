import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TaskFilterModule, TaskListModule } from '@/components/TaskManagement'
import { colors } from '@/styles'
import { faCheckCircle, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { getUserCredentials } from '@/utils'
import { tasksApi } from '@/api/tasks.api'
import { FilterTaskDto } from '@/types/api/tasks'
import { setTasks } from '@/store/reducers/taskSlice'
import { AIAssistor } from '@/components/AIAssistor'

export function TaskManagementPage() {
  const dispatch = useDispatch<AppDispatch>()
  const tasks = useSelector((state: RootState) => state.tasks.tasks)

  useEffect(() => {
    const { uid } = getUserCredentials()

    // If uid is null or not found, stop the process and show an error
    if (!uid) {
      return
    }

    // Fetch all tasks when the component first loads
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await tasksApi.getFilteredTasks(uid, {})
        dispatch(setTasks(fetchedTasks))
      } catch {
        console.log('Error: Failed to fetch tasks.')
      }
    }

    fetchTasks()
  }, [dispatch])

  // This function will be triggered when filters are applied
  const handleFilterChange = async (filters: FilterTaskDto) => {
    const { uid } = getUserCredentials()

    if (!uid) {
      return
    }

    try {
      const filteredTasks = await tasksApi.getFilteredTasks(uid, filters)
      dispatch(setTasks(filteredTasks))
    } catch {
      console.log('Error: Failed to filter tasks.')
    }
  }

  return (
    <div className='flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] w-full justify-center bg-blue-100 px-12 py-6'>
      <div className='grid w-full grid-cols-12 gap-x-4'>
        {/*Task Management Section */}
        <div className='col-span-8 flex flex-col gap-4'>
          <div className='flex items-center gap-x-4' style={{ color: colors.tertiary }}>
            <FontAwesomeIcon icon={faCheckCircle} size='2xl' />
            <span className='text-3xl font-medium'>Task Management</span>
          </div>
          <TaskFilterModule
            onFilterChange={handleFilterChange}
            onClearFilters={() => {
              handleFilterChange({})
            }}
          />
          {/* Task List */}
          <div className='h-full max-h-full w-full rounded-xl border border-gray-200 bg-white shadow-sm'>
            <TaskListModule tasks={tasks} />
          </div>
        </div>
        {/*Task Management Section */}
        <div className='col-span-4 flex h-full flex-col gap-4'>
          <div className='flex items-center justify-center'>
            <div className='flex flex-row items-center gap-x-4' style={{ color: colors.tertiary }}>
              <FontAwesomeIcon icon={faLightbulb} size='2xl' />
              <span className='text-3xl font-medium'>AI Assistor</span>
            </div>
          </div>
          <div className='h-[calc(100vh-156px)] rounded-xl border border-gray-200 bg-white shadow-sm'>
            <AIAssistor />
          </div>
        </div>
      </div>
    </div>
  )
}
