import React, { useState } from 'react'
import { Task } from './task.type'
import './TaskForm.css'

interface TaskFormProps {
  initialTask: Task
  onSubmit: (task: Task) => Promise<void>
  onClose: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit }) => {
  const [task, setTask] = useState<Task>(
    initialTask || {
      id: '',
      name: '',
      description: '',
      priority: 'M',
      status: 'T',
      estimatedTime: 0,
      deadline: '',
      isDistributed: false
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setTask((prevTask) => {
      let parsedValue: any = value
      if (name === 'estimatedTime') {
        parsedValue = parseInt(value, 10) || 0 // Convert to a number
      } else if (name === 'deadline') {
        parsedValue = new Date(value).toISOString() // Convert to ISO string
      }
      return {
        ...prevTask,
        [name]: name === 'deadline' ? parsedValue : parsedValue
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(task)
  }

  const isUpdate = !!task.id

  return (
    <div className='task-form-container'>
      <form onSubmit={handleSubmit} className='task-form'>
        <input
          type='text'
          name='name'
          placeholder='Task Name'
          value={task.name}
          //onChange={(e) => setTask({ ...task, name: e.target.value })}
          onChange={handleChange}
          className='form-input'
          required
        />
        <textarea
          name='description'
          placeholder='Task Description'
          value={task.description}
          //onChange={(e) => setTask({ ...task, description: e.target.value })}
          onChange={handleChange}
          className='form-textarea'
          required
        />
        <label htmlFor='prioritySelect'>Priority:</label>
        <select
          id='prioritySelect'
          name='priority'
          value={task.priority}
          //onChange={(e) => setTask({ ...task, priority: e.target.value as Task['priority'] })}
          onChange={handleChange}
          required
        >
          <option value='H'>High</option>
          <option value='M'>Medium</option>
          <option value='L'>Low</option>
        </select>
        <input
          type='number'
          name='estimatedTime'
          min='0'
          step='1'
          placeholder='Estimated Time (minutes)'
          value={task.estimatedTime}
          //onChange={(e) => setTask({ ...task, estimatedTime: parseInt(e.target.value, 10) || 0 })}
          onChange={handleChange}
          className='form-input'
        />

        <div className='form-group'>
          <label htmlFor='deadline'>Deadline</label>
          <input
            type='datetime-local'
            id='deadline'
            name='deadline'
            value={task.deadline ? task.deadline.slice(0, 16) : ''}
            //onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            onChange={handleChange}
          />
        </div>

        <button
          type='submit'
          className='form-button'
          style={{
            backgroundColor: isUpdate ? 'blue' : 'green',
            color: 'white'
          }}
        >
          {isUpdate ? 'Update Task' : 'Add Task'}
        </button>
      </form>
    </div>
  )
}

export default TaskForm
