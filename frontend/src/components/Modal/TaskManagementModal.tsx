import React, { useEffect, useState } from 'react'
import TaskList from '@/pages/TaskManagement/TaskList'
import AddTask from '@/pages/TaskManagement/AddTask'
import { PrimaryModal } from '@/components/Modal/ModalLayouts'
import { useToast } from '@/hooks/use-toast'
import { FiPlus } from 'react-icons/fi'
import axios from 'axios'
import { Task } from '@/pages/TaskManagement/task.type'

export function TaskManagementModal() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()
  const [uid, setUid] = useState<string>('')
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    if (!token || !uid) {
      getUserCredentials()
    } else {
      fetchTasks()
    }
  }, [])

  useEffect(() => {
    const initialize = async () => {
      const { accessToken, uid } = getUserCredentials()
      if (accessToken && uid) {
        setToken(accessToken)
        setUid(uid)
      } else {
        console.error('Failed to retrieve credentials. Please log in.')
        return
      }
    }
    initialize()
  }, [])

  useEffect(() => {
    if (uid && token) {
      fetchTasks()
    }
  }, [uid, token])

  const handleAddTaskSuccess = () => {
    setModalOpen(false)
    toast({
      title: 'Add task successful',
      description: 'Your task has been added successfully!',
      style: { backgroundColor: 'rgba(5, 203, 59, 0.2)' },
      duration: 2000
    })
    fetchTasks()
  }

  const handleAddTaskFailure = () => {
    toast({
      title: 'Add task failed',
      description: 'There was an error while adding your task.',
      style: { backgroundColor: 'rgba(253, 1, 4, 0.2)' },
      duration: 2000
    })
  }

  const getUserCredentials = (): { accessToken: string | null; uid: string | null } => {
    const storedUser = localStorage.getItem(`firebase:authUser:${import.meta.env.VITE_API_KEY}:[DEFAULT]`)
    if (!storedUser) {
      console.error('No user data found in local storage.')
      return { accessToken: null, uid: null }
    }
    try {
      const userObject = JSON.parse(storedUser)
      const accessToken = userObject?.stsTokenManager?.accessToken || null
      const uid = userObject?.uid || null
      if (!accessToken) {
        console.error('Access token not found in stored user data.')
      }
      if (!uid) {
        console.error('UID not found in stored user data.')
      }
      return { accessToken, uid }
    } catch (error) {
      console.error('Error parsing user data from local storage:', error)
      return { accessToken: null, uid: null }
    }
  }

  const fetchTasks = async () => {
    if (!token || !uid) {
      console.error('Access token or UID is missing. Please log in again.')
      return
    }
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (Array.isArray(response.data)) {
        const transformedTasks = response.data.map((task: any) => ({
          ...task,
          id: task._id
        }))
        setTasks(transformedTasks)
      } else {
        console.error('Tasks data is not an array', response.data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?')
    if (!confirmDelete) return
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      toast({
        title: 'Task deleted successfully!',
        description: `Task with ID ${taskId} has been deleted successfully!`,
        style: { backgroundColor: 'rgba(5, 203, 59, 0.2)' },
        duration: 2000
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: 'Failed to delete task.',
        description: 'There was an error while deleting your task.',
        style: { backgroundColor: 'rgba(253, 1, 4, 0.2)' },
        duration: 2000
      })
    }
  }

  return (
    <div
      className='hi'
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <h1 style={styles.title}>Task Management</h1>
        <button onClick={() => setModalOpen(true)} style={styles.addButton}>
          Add Task&nbsp;&nbsp; <FiPlus size={20} />
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          width: '100%'
        }}
      >
        <TaskList tasks={tasks} onDelete={handleDeleteTask} onUpdate={fetchTasks} />
      </div>

      {isModalOpen && (
        <PrimaryModal isOpen={isModalOpen}>
          <AddTask
            onSuccess={handleAddTaskSuccess}
            onFailure={handleAddTaskFailure}
            onClose={() => setModalOpen(false)}
          />
        </PrimaryModal>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    margin: 0,
    fontSize: '34px',
    fontWeight: 600,
    color: '#333'
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default TaskManagementModal
