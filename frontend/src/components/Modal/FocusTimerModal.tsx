import { useState, useEffect } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader } from '@/components/Indicator'
import { Task } from '@/types/schemas'
import { tasksApi } from '@/api/tasks.api'
import { useToast } from '@/hooks/use-toast'
import { Event } from '@/components/Calendar/event.type'
import { colors, priorityColors, statusColors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPause, faPlay, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { DateTimeBadge, TaskBadge } from '@/components/Badge'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'
import { Input } from '@/components/ui/input'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ButtonFullWidth } from '@/components/Button'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { setTimerIsRunning } from '@/store/reducers/sessionSlice'
import { eventsApi } from '@/api/events.api'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { formatFocusTimer, getUserCredentials } from '@/utils'
import { CreateFocusTimerDto } from '@/types/api/focusTimers'
import { focusTimersApi } from '@/api/focusTimers.api'
import { usersApi } from '@/api/users.api'

const minFocusTime: number = 10
const maxFocusTime: number = 60
const minBreakTime: number = 2
const maxBreakTime: number = 30

export function FocusTimerModal() {
  const { toast } = useToast()
  const [uid, setUid] = useState<string | undefined>()
  const [event, setEvent] = useState<Event | null>(null)
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const dispatch = useDispatch<AppDispatch>()
  const currentEventId = useSelector((state: RootState) => state.session.currentEventId)
  const timerIsRunning = useSelector((state: RootState) => state.session.timerIsRunning)
  const [focusTimerId, setFocusTimerId] = useState<string | null>(null)

  const [key, setKey] = useState(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(timerIsRunning)
  const [isFocusPhase, setIsFocusPhase] = useState(true)
  const [focusDuration, setFocusDuration] = useState(10)
  const [breakDuration, setBreakDuration] = useState(2)
  const [timeSpent, setTimeSpent] = useState(0)
  const [remainingTime, setRemainingTime] = useState(10 * 60)
  const [defaultValues, setDefaultValues] = useState<CreateFocusTimerDto | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<CreateFocusTimerDto>({
    defaultValues: defaultValues || {
      userId: uid!,
      taskId: '',
      focusDuration: focusDuration,
      breakDuration: breakDuration,
      remainingTime: remainingTime,
      timeSpent: 0,
      isActive: false
    },
    mode: 'onChange'
  })

  // Fetch user ID
  useEffect(() => {
    const { uid } = getUserCredentials()

    if (!uid) {
      return
    }

    setUid(uid)
  }, [])

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const fetchedEvent = await eventsApi.getEventById(currentEventId)
        setEvent({
          ...fetchedEvent,
          title: fetchedEvent.title!
        } as Event)
        // Fetch task data based on event
        if (fetchedEvent && fetchedEvent.taskId) {
          const fetchedTask = await tasksApi.getTasksByTaskId(fetchedEvent.taskId)
          setTask(fetchedTask)
          const fetchedFocusTimer = await focusTimersApi.getFocusTimerByTaskId(fetchedTask._id!)
          console.log(fetchedFocusTimer)
          setFocusDuration(fetchedFocusTimer.focusDuration / 60)
          setBreakDuration(fetchedFocusTimer.breakDuration / 60)
          setRemainingTime(fetchedFocusTimer.remainingTime)
          setTimeSpent(fetchedFocusTimer.timeSpent)
          setDefaultValues(
            (prev) =>
              ({
                ...prev,
                taskId: fetchedTask._id!,
                focusDuration: fetchedFocusTimer.focusDuration / 60,
                breakDuration: fetchedFocusTimer.breakDuration / 60,
                remainingTime: fetchedFocusTimer.remainingTime,
                timeSpent: fetchedFocusTimer.timeSpent,
                isActive: false
              }) as CreateFocusTimerDto
          )
          reset({
            userId: uid!,
            taskId: fetchedTask._id!,
            eventId: currentEventId,
            focusDuration: fetchedFocusTimer.focusDuration / 60,
            breakDuration: fetchedFocusTimer.breakDuration / 60,
            remainingTime: fetchedFocusTimer.remainingTime,
            timeSpent: fetchedFocusTimer.timeSpent,
            isActive: false
          })
        }
      } catch {
        toast({
          title: 'Failed to fetch event or task data.',
          description: 'There was a problem, please retry later.'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(async () => {
        try {
          setRemainingTime((prevRemainingTime) => {
            const newRemainingTime = prevRemainingTime - 10
            focusTimersApi.updateFocusTimer(focusTimerId!, { remainingTime: newRemainingTime })
            return newRemainingTime
          })
          setTimeSpent((prevTimeSpent) => {
            const newTimeSpent = prevTimeSpent + 10
            focusTimersApi.updateFocusTimer(focusTimerId!, { timeSpent: newTimeSpent })
            return newTimeSpent
          })
        } catch (error) {
          console.error('Failed to update focus timer:', error)
        }
      }, 10000) // Update every 10 seconds
    } else if (!isPlaying && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [focusTimerId, isPlaying, task])

  const onSubmit: SubmitHandler<CreateFocusTimerDto> = async (data: CreateFocusTimerDto) => {
    try {
      // Ensure focusDuration and breakDuration are valid numbers
      if (isNaN(data.focusDuration) || isNaN(data.breakDuration)) {
        throw new Error('Focus duration or break duration is not a valid number')
      }

      // Check if a focus timer with the given taskId exists
      const existingFocusTimer = await focusTimersApi.getFocusTimerByTaskId(task!._id!)
      setFocusDuration(data.focusDuration * 60)
      setBreakDuration(data.breakDuration * 60)
      setRemainingTime(data.focusDuration)

      if (existingFocusTimer) {
        console.log('existing', existingFocusTimer)
        setFocusTimerId(existingFocusTimer._id!)
        // Update the existing focus timer
        await focusTimersApi.updateFocusTimer(existingFocusTimer._id!, {
          userId: uid!,
          taskId: task!._id!,
          eventId: currentEventId,
          focusDuration: data.focusDuration * 60,
          breakDuration: data.breakDuration * 60,
          remainingTime: data.focusDuration * 60,
          isActive: false
        })
        toast({
          title: 'Focus Timer updated successfully.',
          description: 'Your focus timer has been updated.'
        })
      } else {
        // Create a new focus timer
        const createdFocusTimer = await focusTimersApi.createFocusTimer({
          userId: uid!,
          taskId: task!._id!,
          eventId: currentEventId,
          focusDuration: data.focusDuration * 60,
          breakDuration: data.breakDuration * 60,
          remainingTime: data.focusDuration * 60,
          timeSpent: 0,
          isActive: false
        })
        console.log('created', createdFocusTimer)
        setFocusTimerId(createdFocusTimer._id!)
        toast({
          title: 'Focus Timer created successfully.',
          description: 'Your focus timer has been created.'
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to create or update focus timer.',
        description: error instanceof Error ? error.message : 'An error occurred during focus timer creation or update.'
      })
      console.log(error)
    }
  }

  const handleStartTimer = () => {
    setIsPlaying(true)
    dispatch(setTimerIsRunning(true))
  }

  const handleStartAndSubmit = async () => {
    handleStartTimer()
    handleSubmit(onSubmit)()
  }

  useEffect(() => {
    const updateActiveFocusTimer = async () => {
      try {
        if (uid) {
          if (focusTimerId) {
            await usersApi.setActiveFocusTimer(uid, focusTimerId)
          } else {
            await usersApi.clearActiveFocusTimer(uid)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    updateActiveFocusTimer()
  }, [focusTimerId, uid])

  const handlePauseTimer = async () => {
    setIsPlaying(false)
    dispatch(setTimerIsRunning(false))
    setFocusTimerId(null)
    toast({
      title: 'Focus session paused.',
      description: 'Focus timer paused.'
    })
  }

  const handleResetTimer = () => {
    setKey((prevKey) => prevKey + 1)
  }

  const handleResetAndSubmit = () => {
    handleResetTimer()
    handleSubmit(onSubmit)()
  }

  const handleTimerPhaseChange = () => {
    setIsFocusPhase((prev) => !prev)
    setKey((prevKey) => prevKey + 1)
  }

  const canStartTimer: boolean = task === null ? false : task?.status === 'IP' ? true : false

  const timerDescription = timerIsRunning
    ? 'Timer is running'
    : canStartTimer
      ? 'You can start a timer session for this task'
      : `You can't start a timer session for this task`

  return (
    <div className='flex w-full gap-6'>
      {/* Task details */}
      <div className='flex w-[320px] flex-col gap-6 py-2'>
        {task && event && (
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
      <VisuallyHidden.Root>
        <DialogHeader>
          <DialogTitle className='line-clamp-3'>empty</DialogTitle>
          <DialogDescription className='line-clamp-4'>empty</DialogDescription>
        </DialogHeader>
      </VisuallyHidden.Root>
      <div className='h-full w-[1px] bg-slate-300'></div>
      {/* Timer Session */}
      <div className='flex w-[320px] flex-col items-center gap-6'>
        <div className='w-full'>
          <h2 className='text-lg font-semibold'>Timer Session</h2>
          <p className='text-sm' style={{ color: canStartTimer ? colors.text_primary : '#f00' }}>
            {timerDescription}
          </p>
        </div>
        <div className='flex w-full flex-row items-center justify-between text-sm font-medium'>
          <div className='flex flex-col gap-1'>
            <span style={{ color: colors.text_secondary }}>Focus time (minutes)</span>
            <Controller
              name='focusDuration'
              control={control}
              rules={{
                required: 'Required',
                min: { value: minFocusTime, message: `Focus time must be at least ${minFocusTime} minutes.` },
                max: { value: maxFocusTime, message: `Focus time at most ${maxFocusTime} minutes.` }
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  type='number'
                  min={10}
                  max={60}
                  id='focusDuration'
                  value={value}
                  onChange={(e) => {
                    const newValue = Number(e.target.value)
                    onChange(newValue)
                    setFocusDuration(newValue)
                  }}
                  disabled={isPlaying || !canStartTimer}
                  className='col-span-3'
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <span style={{ color: colors.text_secondary }}>Break time (minutes)</span>
            <Controller
              name='breakDuration'
              control={control}
              rules={{
                required: 'Required',
                min: { value: minBreakTime, message: `Break time must be at least ${minBreakTime} minutes.` },
                max: { value: maxBreakTime, message: `Break time at most ${maxBreakTime} minutes.` }
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  type='number'
                  min={10}
                  max={60}
                  id='breakDuration'
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  disabled={isPlaying || !canStartTimer}
                  className='col-span-3'
                />
              )}
            />
          </div>
        </div>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={isFocusPhase ? focusDuration * 60 : breakDuration * 60}
          colors={['#004777', '#F7B801', '#A30000']}
          colorsTime={[
            isFocusPhase ? focusDuration : breakDuration,
            (isFocusPhase ? focusDuration : breakDuration) / 2,
            0
          ]}
          onComplete={() => {
            handleTimerPhaseChange()
            return { shouldRepeat: false }
          }}
        >
          {({ remainingTime }) => {
            return (
              <div className='flex flex-col items-center justify-center gap-1 font-medium'>
                <span style={{ color: colors.text_primary }}>{isFocusPhase ? 'Focus Time' : 'Break Time'}</span>
                <span className='text-2xl' style={{ color: colors.primary }}>
                  {formatFocusTimer(remainingTime)}
                </span>
              </div>
            )
          }}
        </CountdownCircleTimer>
        <div className='flex w-full justify-between'>
          <div className='w-[132px]'>
            {!isPlaying ? (
              <ButtonFullWidth
                enabled={canStartTimer && isValid}
                text='Start'
                icon={faPlay}
                onClick={handleStartAndSubmit}
              />
            ) : (
              <ButtonFullWidth enabled={true} text='Pause' icon={faPause} onClick={handlePauseTimer} />
            )}
          </div>
          <div className='w-[132px]'>
            <ButtonFullWidth
              enabled={!isPlaying}
              text='Set Timer'
              icon={faRefresh}
              onClick={handleResetAndSubmit}
              backgroundColor='#f00'
            />
          </div>
        </div>
      </div>
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
      <div className='col-span-3 flex items-center text-sm'>
        <span style={{ color: colors.text_secondary }}>{label}</span>
      </div>
      <div className='col-span-9'>
        <DateTimeBadge date={date} />
      </div>
    </div>
  )
}
