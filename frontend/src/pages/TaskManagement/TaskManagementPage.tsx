import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TaskFilterModule, TaskListModule } from '@/components/TaskManagement'
import { colors } from '@/styles'
import { faCheckCircle, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { getUserCredentials } from '@/utils'
import { tasksApi } from '@/api/services/tasks'
import { FilterTaskDto } from '@/types/api/tasks'
import { AIAssistor } from '@/components/AIAssistor'
import { useQuery } from '@tanstack/react-query'
import { TaskListQueryProvider } from '@/context/Task'

function TaskManagementPage() {
  const { uid } = getUserCredentials()
  const [filters, setFilters] = useState<FilterTaskDto>({})

  const {
    isLoading,
    isError,
    data: tasks = [],
    error
  } = useQuery({
    queryKey: ['tasks', uid, filters],
    queryFn: async () => {
      if (!uid) {
        throw new Error('Unathorized user.')
      }
      const data = await tasksApi.getFilteredTasks(uid, filters)
      return data
    }
  })

  const handleFilterChange = (filters: FilterTaskDto) => {
    setFilters(filters)
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
            <TaskListQueryProvider isLoading={isLoading} isError={isError} error={error}>
              <TaskListModule tasks={tasks} />
            </TaskListQueryProvider>
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
            <AIAssistor filters={filters} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskManagementPage
