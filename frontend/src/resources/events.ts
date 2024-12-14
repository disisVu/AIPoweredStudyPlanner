import { Task } from '@/../../shared/src/schemas/Task'
import { Event } from '@/../../shared/src/schemas/Event'

const tasks: Task[] = [
  {
    _id: '64a7b8a2f3a12d1234560000',
    user_id: 'user000',
    name: 'Presentation',
    deadline: new Date('2024-12-18'),
    created_at: new Date('2024-11-30'),
    updated_at: new Date('2024-12-10')
  },
  {
    _id: '64a7b8a2f3a12d1234560001',
    user_id: 'user001',
    name: 'Project Meeting',
    deadline: new Date('2024-12-20'),
    created_at: new Date('2024-12-01'),
    updated_at: new Date('2024-12-10')
  },
  {
    _id: '64a7b8a2f3a12d1234560002',
    user_id: 'user002',
    name: 'Code Review',
    deadline: new Date('2024-12-15'),
    created_at: new Date('2024-12-05'),
    updated_at: new Date('2024-12-11')
  },
  {
    _id: '64a7b8a2f3a12d1234560003',
    user_id: 'user003',
    name: 'Design Presentation',
    deadline: new Date('2024-12-22'),
    created_at: new Date('2024-12-03'),
    updated_at: new Date('2024-12-09')
  }
]

const events: Event[] = [
  {
    _id: '64a7b8a2f3a12d1234570000',
    task_id: '64a7b8a2f3a12d1234560000',
    user_id: 'user000',
    start_time: new Date('2024-12-11T07:00:00'),
    end_time: new Date('2024-12-11T08:30:00'),
    created_at: new Date('2024-12-10T08:00:00')
  },
  {
    _id: '64a7b8a2f3a12d1234570001',
    task_id: '64a7b8a2f3a12d1234560001',
    user_id: 'user001',
    start_time: new Date('2024-12-12T09:00:00'),
    end_time: new Date('2024-12-12T10:00:00'),
    created_at: new Date('2024-12-10T08:00:00')
  },
  {
    _id: '64a7b8a2f3a12d1234570002',
    task_id: '64a7b8a2f3a12d1234560002',
    user_id: 'user002',
    start_time: new Date('2024-12-13T14:00:00'),
    end_time: new Date('2024-12-13T15:30:00'),
    created_at: new Date('2024-12-11T10:00:00')
  },
  {
    _id: '64a7b8a2f3a12d1234570003',
    task_id: '64a7b8a2f3a12d1234560003',
    user_id: 'user003',
    start_time: new Date('2024-12-14T11:00:00'),
    end_time: new Date('2024-12-14T12:30:00'),
    created_at: new Date('2024-12-11T11:00:00')
  },
  {
    _id: '64a7b8a2f3a12d1234570004',
    task_id: '64a7b8a2f3a12d1234560002',
    user_id: 'user003',
    start_time: new Date('2024-12-14T12:30:00'),
    end_time: new Date('2024-12-14T14:30:00'),
    created_at: new Date('2024-12-11T11:00:00')
  },
  {
    _id: '64a7b8a2f3a12d1234570004',
    task_id: '64a7b8a2f3a12d1234560002',
    user_id: 'user003',
    start_time: new Date('2024-12-14T14:45:00'),
    end_time: new Date('2024-12-14T15:30:00'),
    created_at: new Date('2024-12-11T11:00:00')
  },
  {
    _id: '64a7b8a2f3a12d1234570004',
    task_id: '64a7b8a2f3a12d1234560002',
    user_id: 'user003',
    start_time: new Date('2024-12-14T16:30:00'),
    end_time: new Date('2024-12-14T17:30:00'),
    created_at: new Date('2024-12-11T11:00:00')
  }
]

export { tasks, events }
