import { useState, useEffect } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader } from '@/components/Indicator'
import { Task } from '@/types/schemas'
import { tasksApi } from '@/api/tasks.api'
import { useToast } from '@/hooks/use-toast'
import { Event } from '@/components/Calendar/event.type'
import { colors, priorityColors, statusColors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { DateTimeBadge, TaskBadge } from '@/components/Badge'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'

interface FocusTimerModalProps {
  event: Event
}

export function FocusTimerModal({ event }: FocusTimerModalProps) {
  const { toast } = useToast()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const fetchedTask = await tasksApi.getTasksByTaskId(event.taskId)
        if (fetchedTask) {
          setTask(fetchedTask)
        }
      } catch {
        toast({
          title: 'Failed to fetch task data.',
          description: 'There was a problem, please retry later.'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTaskData()
  }, [event.taskId, toast])

  return (
    // Task details
    <div className='flex flex-col gap-6 py-2'>
      {task && (
        <>
          {/* Priority and Status */}
          <div className='flex flex-row items-center gap-2'>
            <TaskBadge
              label={taskPriorityLabels[task.priority]}
              textColor={priorityColors[task.priority].textColor}
              bgColor={priorityColors[task.priority].bgColor}
            />
            <TaskBadge
              label={taskStatusLabels[task.status]}
              textColor={statusColors[task.status].textColor}
              bgColor={statusColors[task.status].bgColor}
            />
          </div>
          {/* Name */}
          <DialogHeader>
            <DialogTitle className='line-clamp-3'>{task.name}</DialogTitle>
            <DialogDescription className='line-clamp-4'>{task.description}</DialogDescription>
          </DialogHeader>
          {/* Start, end and deadline time */}
          <div className='flex flex-col'>
            <DateTimeField label='Start' date={event.start} />
            <div className='w-full pl-0'>
              <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: colors.text_secondary }} size='sm' />
            </div>
            <DateTimeField label='End' date={event.end} />
            <div className='w-full pl-0'>
              <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: colors.text_secondary }} size='sm' />
            </div>
            <DateTimeField label='Deadline' date={task.deadline} />
          </div>
        </>
      )}
      {isLoading && <Loader />}
    </div>
  )
}

interface DateTimeFieldProps {
  label: string
  date: Date
}

function DateTimeField({ label, date }: DateTimeFieldProps) {
  return (
    <div className='grid w-full grid-cols-12 font-medium'>
      <div className='col-span-2 flex items-center text-sm'>
        <span style={{ color: colors.text_secondary }}>{label}</span>
      </div>
      <div className='col-span-10'>
        <DateTimeBadge date={date} />
      </div>
    </div>
  )
}
