import { createContext } from 'react'

interface TaskListQueryContextType {
  isLoading: boolean
  isError: boolean
  error: Error | null
}

const TaskListQueryContext = createContext<TaskListQueryContextType | undefined>(undefined)

const TaskListQueryProvider: React.FC<{
  isLoading: boolean
  isError: boolean
  error: Error | null
  children: React.ReactNode
}> = ({ isLoading, isError, error, children }) => {
  return <TaskListQueryContext.Provider value={{ isLoading, isError, error }}>{children}</TaskListQueryContext.Provider>
}

export { TaskListQueryContext, TaskListQueryProvider }
