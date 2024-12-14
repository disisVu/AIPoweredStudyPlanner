import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Task } from './task.type'
import './TaskList.css'
import { MdDeleteOutline } from 'react-icons/md'
import TaskForm from './TaskForm'
import { IoCloseSharp } from 'react-icons/io5'
import { useToast } from '@/hooks/use-toast'
import { getUserCredentials as getUserCredentialsUtil } from '@/utils'

interface TaskListProp {
  tasks: Task[]
  onDelete: (taskId: string) => void
  onUpdate: () => void
}

const TaskList: React.FC<TaskListProp> = ({ tasks, onDelete, onUpdate }) => {
  const [filter, setFilter] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { toast } = useToast()
  const [uid, setUid] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const handleEdit = (task: Task) => {
    setIsEditing(true)
    setSelectedTask(task)
  }

  useEffect(() => {
    if (!token || !uid) {
      getUserCredentials()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserCredentials = (): { accessToken: string | null; uid: string | null } => {
    // const storedUser = localStorage.getItem(`firebase:authUser:${import.meta.env.VITE_API_KEY}:[DEFAULT]`)
    // if (!storedUser) {
    //   console.error('No user data found in local storage.')
    //   return { accessToken: null, uid: null }
    // }

    try {
      // const userObject = JSON.parse(storedUser)
      // const accessToken = userObject?.stsTokenManager?.accessToken || null
      // const uid = userObject?.uid || null
      const { accessToken, uid } = getUserCredentialsUtil()

      if (!accessToken) {
        console.error('Access token not found in stored user data.')
      } else if (!uid) {
        console.error('UID not found in stored user data.')
      } else {
        setUid(uid)
        setToken(accessToken)
      }
      return { accessToken, uid }
    } catch (error) {
      console.error('Error parsing user data from local storage:', error)
      return { accessToken: null, uid: null }
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await axios.patch(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsEditing(false)
      onUpdate()
      toast({
        title: 'Update task successful',
        description: 'Your task has been update successfully!',
        style: { backgroundColor: 'rgba(5, 203, 59, 0.2)' },
        duration: 2000
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: 'Update task failed',
        description: 'There was an error while updating your task.',
        style: { backgroundColor: 'rgba(253, 1, 4, 0.2)' },
        duration: 2000
      })
    }
  }

  // Filter tasks based on search and filter values
  const filteredTasks = tasks
    .filter((task) => task.name.includes(search))
    .filter((task) => (filter ? task.priority === filter : true))

  return (
    <div className='tasklist-container'>
      <div className='tasklist-header'>
        <input
          type='text'
          placeholder='Search tasks...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='search-input'
        />
        <label htmlFor='priorityFilter'>Filter by Priority:</label>
        <select
          id='priorityFilter'
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
          className='filter-select'
        >
          <option value=''>All Priorities</option>
          <option value='H'>High</option>
          <option value='M'>Medium</option>
          <option value='L'>Low</option>
        </select>
      </div>

      <div className='task-list-grid'>
        {filteredTasks.map((task) => (
          <div key={task.id} className='task-card' onClick={() => handleEdit(task)}>
            <h3 className='task-name'>{task.name}</h3>
            <p className='task-description'>{task.description}</p>
            <div className='task-actions'>
              <button
                className='delete-btn'
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
              >
                <MdDeleteOutline size={20} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {isEditing && selectedTask && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <div className='popup-header'>
              <h2>Edit Task</h2>
              <button className='close-button' onClick={() => setIsEditing(false)}>
                <IoCloseSharp size={32} />
              </button>
            </div>
            <TaskForm initialTask={selectedTask} onSubmit={handleUpdateTask} onClose={() => setIsEditing(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList
