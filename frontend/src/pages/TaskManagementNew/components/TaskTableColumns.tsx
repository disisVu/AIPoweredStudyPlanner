import { ColumnDef } from '@tanstack/react-table'
import { Task } from '@/types/schemas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons'
import { formatDate, taskSortOrder } from '@/utils'
import { TaskBadge } from '@/components/Badge'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'
import { priorityColors, statusColors } from '@/styles'

export const taskTableColumns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className='ml-2 cursor-pointer' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Task Name</span>
          <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
        </div>
      )
    },
    cell: ({ row }) => {
      const taskName: string = row.getValue('name')
      return <div className='ml-2 text-left font-medium'>{taskName}</div>
    },
    size: 300
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <div
        className='flex cursor-pointer items-center'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>Priority</span>
        <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
      </div>
    ),
    cell: ({ row }) => {
      const taskPriority: Task['priority'] = row.getValue('priority')
      return (
        <div className='max-w-24'>
          <TaskBadge
            label={taskPriorityLabels[taskPriority]}
            textColor={priorityColors[taskPriority].textColor}
            bgColor={priorityColors[taskPriority].bgColor}
          />
        </div>
      )
    },
    sortingFn: (a, b) =>
      taskSortOrder.priorityOrder.indexOf(a.original.priority) -
      taskSortOrder.priorityOrder.indexOf(b.original.priority),
    size: 100
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div
        className='flex cursor-pointer items-center'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>Status</span>
        <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
      </div>
    ),
    cell: ({ row }) => {
      const taskStatus: Task['status'] = row.getValue('status')
      return (
        <div className='max-w-24'>
          <TaskBadge
            label={taskStatusLabels[taskStatus]}
            textColor={statusColors[taskStatus].textColor}
            bgColor={statusColors[taskStatus].bgColor}
          />
        </div>
      )
    },
    sortingFn: (a, b) =>
      taskSortOrder.statusOrder.indexOf(a.original.status) - taskSortOrder.statusOrder.indexOf(b.original.status),
    size: 100
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => (
      <div
        className='mr-2 cursor-pointer text-right'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>Deadline</span>
        <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
      </div>
    ),
    cell: ({ row }) => {
      const taskDeadline: Date = new Date(row.getValue('deadline'))
      return <div className='mr-2 text-right font-medium'>{formatDate(taskDeadline)}</div>
    },
    sortingFn: 'datetime',
    size: 100
  }
]
