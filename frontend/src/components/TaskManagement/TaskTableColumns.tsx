import { ColumnDef } from '@tanstack/react-table'
import { Task } from '@/types/schemas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsUpDown, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { formatDate, taskSortOrder } from '@/utils'
import { TaskBadge } from '@/components/Badge'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'
import { colors, priorityColors, statusColors } from '@/styles'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { EditTaskModal } from '@/components/Modal'

interface TaskTableColumnsProps {
  handleDeleteTask: (taskId: string) => void
}

export const taskTableColumns = ({ handleDeleteTask }: TaskTableColumnsProps): ColumnDef<Task>[] => [
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
      return <div className='ml-2 truncate text-left font-medium'>{taskName}</div>
    },
    size: 300
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <div className='flex w-full justify-center'>
        <div
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Priority</span>
          <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const taskPriority: Task['priority'] = row.getValue('priority')
      return (
        <div className='flex w-full justify-center'>
          <div className='min-w-24 max-w-24'>
            <TaskBadge
              label={taskPriorityLabels[taskPriority]}
              textColor={priorityColors[taskPriority].textColor}
              bgColor={priorityColors[taskPriority].bgColor}
            />
          </div>
        </div>
      )
    },
    sortingFn: (a, b) =>
      taskSortOrder.priorityOrder.indexOf(a.original.priority) -
      taskSortOrder.priorityOrder.indexOf(b.original.priority),
    size: 60
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div className='flex w-full justify-center'>
        <div
          className='flex cursor-pointer items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Status</span>
          <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const taskStatus: Task['status'] = row.getValue('status')
      return (
        <div className='flex w-full justify-center'>
          <div className='min-w-24 max-w-24'>
            <TaskBadge
              label={taskStatusLabels[taskStatus]}
              textColor={statusColors[taskStatus].textColor}
              bgColor={statusColors[taskStatus].bgColor}
            />
          </div>
        </div>
      )
    },
    sortingFn: (a, b) =>
      taskSortOrder.statusOrder.indexOf(a.original.status) - taskSortOrder.statusOrder.indexOf(b.original.status),
    size: 60
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => (
      <div className='flex w-full justify-center'>
        <div className='cursor-pointer text-left' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Deadline</span>
          <FontAwesomeIcon icon={faArrowsUpDown} className='ml-2' />
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const taskDeadline: Date = new Date(row.getValue('deadline'))
      return (
        <div className='flex w-full justify-center'>
          <div className='text-left font-medium'>{formatDate(taskDeadline)}</div>
        </div>
      )
    },
    sortingFn: 'datetime',
    size: 60
  },
  {
    accessorKey: 'actions',
    header: undefined,
    cell: ({ row }) => {
      const task = row.original
      return (
        <div className='flex w-full justify-end'>
          <Popover>
            <PopoverTrigger asChild>
              <div className='mr-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-right font-medium hover:bg-gray-200'>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </div>
            </PopoverTrigger>
            <PopoverContent side='bottom' align='end' sideOffset={10} className='max-w-36 px-0 py-2 text-sm'>
              <div className='text-sm'>
                <div className='w-full px-4 py-2'>
                  <span className='font-medium' style={{ color: colors.text_secondary }}>
                    Task Actions
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div
                      className='flex w-full cursor-pointer gap-4 px-4 py-2 hover:bg-gray-200'
                      style={{ color: colors.text_primary }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} size='lg' />
                      <span>Edit</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[540px]'>
                    <EditTaskModal initialTask={task} />
                  </DialogContent>
                </Dialog>
                <div
                  className='flex w-full cursor-pointer gap-4 px-4 py-2 hover:bg-gray-200'
                  style={{ color: colors.text_primary }}
                  onClick={() => handleDeleteTask(task._id!)}
                >
                  <FontAwesomeIcon icon={faTrashCan} size='lg' />
                  <span>Delete</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    size: 20
  }
]
