import { useContext } from 'react'
import { TaskListQueryContext } from './TaskListQueryContext'

export const useTaskListQueryContext = () => {
  const context = useContext(TaskListQueryContext)
  if (!context) {
    throw new Error('useTaskListContext must be used within a TaskListQueryProvider')
  }
  return context
}
