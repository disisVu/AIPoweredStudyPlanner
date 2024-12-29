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
import { getUserCredentials } from '@/utils'
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
  const [remainingTime, setRemainingTime] = useState(focusDuration)

  const [defaultValues, setDefaultValues] = useState<CreateFocusTimerDto | null>(null)

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
          setDefaultValues({
            userId: uid!,
            taskId: fetchedTask._id!,
            eventId: currentEventId,
            focusDuration: focusDuration,
            breakDuration: breakDuration,
            remainingTime: focusDuration,
            timeSpent: 0,
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
    const fetchActiveFocusTimer = async () => {
      try {
        if (timerIsRunning && uid) {
          const activeFocusTimer = await usersApi.getActiveFocusTimer(uid)
          if (activeFocusTimer) {
            console.log('active focus timer:', activeFocusTimer)
            setFocusDuration(activeFocusTimer.focusDuration)
            setBreakDuration(activeFocusTimer.breakDuration)
            setRemainingTime(activeFocusTimer.remainingTime)
          }
        }
      } catch (error) {
        console.error('Failed to fetch active focus timer:', error)
      }
    }

    fetchActiveFocusTimer()
  }, [timerIsRunning, uid])

  const {
    control,
    handleSubmit,
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

  const onSubmit: SubmitHandler<CreateFocusTimerDto> = async (data: CreateFocusTimerDto) => {
    try {
      setFocusDuration(data.focusDuration)
      setBreakDuration(data.breakDuration)
      setRemainingTime(data.remainingTime)

      saveFocusTimer(data)
      handleChangeTimerDurations()
    } catch (error) {
      toast({
        title: 'Failed to create or update focus timer.',
        description: 'An error occurred during focus timer creation or update.'
      })
      console.log(error)
    }
  }

  const saveFocusTimer = async (data: CreateFocusTimerDto) => {
    try {
      const existingFocusTimer = await focusTimersApi.getFocusTimerByTaskId(task!._id!)
      if (existingFocusTimer) {
        // Update the existing focus timer
        const updatedFocusTimer = await focusTimersApi.updateFocusTimer(existingFocusTimer._id!, {
          ...data,
          taskId: existingFocusTimer.taskId
        })
        setFocusTimerId(updatedFocusTimer._id!)
        console.log('updated focusTimerId: ', updatedFocusTimer._id)
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
          focusDuration: data.focusDuration,
          breakDuration: data.breakDuration,
          remainingTime: data.focusDuration,
          timeSpent: 0,
          isActive: false
        })
        setFocusTimerId(createdFocusTimer._id!)
        console.log('created focusTimerId: ', createdFocusTimer._id)
        toast({
          title: 'Focus Timer created successfully.',
          description: 'Your focus timer has been created.'
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to create focus timer.',
        description: 'An error occurred during focus timer creation.'
      })
      console.log(error)
    }
  }

  const handleStartTimer = async () => {
    setIsPlaying(true)
    dispatch(setTimerIsRunning(true))
    saveFocusTimer(defaultValues!)
    toast({
      title: 'Focus session started.',
      description: 'Focus timer is running now.'
    })
    try {
      await usersApi.setActiveFocusTimer(uid!, focusTimerId!)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePauseTimer = async () => {
    setIsPlaying(false)
    dispatch(setTimerIsRunning(false))
    toast({
      title: 'Focus session paused.',
      description: 'Focus timer paused.'
    })
    try {
      await usersApi.clearActiveFocusTimer(uid!)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeTimerDurations = () => {
    handleReset()
    setIsPlaying(false)
    dispatch(setTimerIsRunning(false))
    toast({
      title: 'Focus session durations updated.',
      description: 'Focus time and Break time have been updated.'
    })
  }

  const handleReset = () => {
    setKey((prevKey) => prevKey + 1)
  }

  // const onTimerComplete = () => {
  //   setKey((prevKey) => prevKey + 1)
  //   setIsPlaying(false)
  //   dispatch(setTimerIsRunning(false))
  // }

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
      <div className='flex w-[320px] flex-col gap-6'>
        <div>
          <h2 className='text-lg font-semibold'>Timer Session</h2>
          <p className='text-sm' style={{ color: canStartTimer ? colors.text_primary : '#f00' }}>
            {timerDescription}
          </p>
        </div>
        <div className='flex flex-row items-center gap-6 text-sm font-medium'>
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
                  onChange={(e) => onChange(Number(e.target.value))}
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
          duration={isFocusPhase ? focusDuration : breakDuration}
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
          {({ remainingTime }) => (
            <div>
              {isFocusPhase ? 'Focus Time' : 'Break Time'}: {remainingTime}s
            </div>
          )}
        </CountdownCircleTimer>
        <div className='flex w-full gap-6'>
          <div className='w-[132px]'>
            {!isPlaying ? (
              <ButtonFullWidth
                enabled={canStartTimer && isValid}
                text='Start'
                icon={faPlay}
                onClick={handleStartTimer}
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
              onClick={handleSubmit(onSubmit)}
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
