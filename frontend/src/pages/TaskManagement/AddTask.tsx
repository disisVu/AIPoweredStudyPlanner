import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TaskForm from './TaskForm'
import { Task } from './task.type'
import { IoCloseSharp } from 'react-icons/io5'
import { getUserCredentials as getUserCredentialsUtil } from '@/utils'

interface AddTaskProps {
  onSuccess: () => void
  onFailure: () => void
  onClose: () => void
}

const AddTask: React.FC<AddTaskProps> = ({ onSuccess, onFailure, onClose }) => {
  const [uid, setUid] = useState<string>('')
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    getUserCredentials()
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

      if (!accessToken || !uid) {
        console.error('Access token not found in stored user data.')
        console.error('UID not found in stored user data.')
      } else {
        console.log(accessToken)
        console.log(uid)
        setUid(uid)
        setToken(accessToken)
      }
      return { accessToken, uid }
    } catch (error) {
      console.error('Error parsing user data from local storage:', error)
      return { accessToken: null, uid: null }
    }
  }

  const handleAddTask = async (task: Task) => {
    try {
      await axios.post(
        'http://localhost:5000/tasks',
        { ...task, userId: uid },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      alert('Task added!')
      onSuccess()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Specific error handling for Axios errors
        console.error('Error response:', error.response?.data || error.message)
        alert(`Failed to add task: ${error.response?.data?.message || error.message}`)
      } else {
        // Generic error fallback
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred.')
      }
      onFailure()
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add New Task</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <IoCloseSharp size={32} />
          </button>
        </div>
        <TaskForm
          initialTask={{
            id: '',
            name: '',
            description: '',
            priority: 'M',
            status: 'T',
            estimatedTime: 0,
            deadline: ''
          }}
          onSubmit={handleAddTask}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '500px',
    maxWidth: '90%',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
    position: 'relative' as const
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: 'red',
    cursor: 'pointer'
  }
}

export default AddTask
