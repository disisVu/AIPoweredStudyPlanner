import { useEffect, useState } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingIndicator } from '@/components/Indicator'
import { tasksApi } from '@/api/services/tasks'
import { useToast } from '@/hooks/use-toast'
import { colors, priorityColors, statusColors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEllipsisVertical, faPause, faPlay, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { DateTimeBadge, TaskBadge } from '@/components/Badge'
import { taskPriorityLabels, taskStatusLabels } from '@/types/enum/taskLabel'
import { Input } from '@/components/ui/input'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ButtonFullWidth } from '@/components/Button'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { setTimerIsRunning } from '@/store/reducers/sessionSlice'
import { eventsApi } from '@/api/services/events'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { formatFocusTimer, getUserCredentials } from '@/utils'
import { CreateFocusTimerDto } from '@/types/api/focusTimers'
import { focusTimersApi } from '@/api/services/focusTimers'
import { usersApi } from '@/api/services/users'
import audioTimerFinish from '@/assets/audio/timerFinish.mp3'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTimer } from '../../hooks'
import { UpdateTaskDto } from '../../types/api/tasks'

// DEFAULT VALUES
// Minutes
const timeMultipler: number = 1
const minFocusTime: number = 10
const maxFocusTime: number = 60
const minBreakTime: number = 2
const maxBreakTime: number = 30

// Milliseconds
const interval: number = 5000

export function FocusTimerModal() {
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()

  const { uid } = getUserCredentials()
  const currentEventId = useSelector((state: RootState) => state.session.currentEventId)
  const timerIsRunning = useSelector((state: RootState) => state.session.timerIsRunning)

  const [key, setKey] = useState(0)

  const [isFocusPhase, setIsFocusPhase] = useState(true)
  const [duration, setDuration] = useState(minFocusTime)
  const [remainingTime, setRemainingTime] = useState(minFocusTime * timeMultipler)
  const [timeSpent, setTimeSpent] = useState(0)

  const [defaultValues, setDefaultValues] = useState<CreateFocusTimerDto | null>(null)
  const [canMarkAsComplete, setCanMarkAsComplete] = useState<boolean>(false)

  function setFocusTimerFormDefaultValues(taskId: string, focusTimer: CreateFocusTimerDto) {
    setDefaultValues(
      (prev) =>
        ({
          ...prev,
          taskId: taskId,
          focusDuration: focusTimer.focusDuration / timeMultipler,
          breakDuration: focusTimer.breakDuration / timeMultipler,
          remainingTime: focusTimer.remainingTime,
          timeSpent: focusTimer.timeSpent,
          isActive: false
        }) as CreateFocusTimerDto
    )
  }

  function resetFocusTimerForm(taskId: string, focusTimer: CreateFocusTimerDto) {
    reset({
      userId: uid!,
      taskId: taskId,
      eventId: currentEventId,
      focusDuration: focusTimer.focusDuration / timeMultipler,
      breakDuration: focusTimer.breakDuration / timeMultipler,
      remainingTime: focusTimer.remainingTime,
      timeSpent: focusTimer.timeSpent,
      isActive: false
    })
  }

  const eventQuery = useQuery({
    queryKey: ['current-event', uid],
    queryFn: async () => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      if (!currentEventId) {
        throw new Error('Undefined event ID.')
      }
      const fetchedEvent = await eventsApi.getEventById(currentEventId)
      return fetchedEvent
    }
  })

  const taskQuery = useQuery({
    queryKey: ['current-task', uid],
    queryFn: async () => {
      if (!eventQuery.data?.taskId) {
        throw new Error('Undefined task ID.')
      }
      const fetchedTask = await tasksApi.getTasksByTaskId(eventQuery.data.taskId)
      return fetchedTask
    },
    enabled: eventQuery.isSuccess
  })

  const taskUpdateMutation = useMutation({
    mutationKey: ['update-task', uid],
    mutationFn: async (data: { taskId: string; taskData: UpdateTaskDto }) => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      const updatedTask = await tasksApi.updateTask(data.taskId, data.taskData)
      return updatedTask
    }
  })

  const focusTimerQuery = useQuery({
    queryKey: ['current-focus-timer', uid],
    queryFn: async () => {
      const taskId = taskQuery.data?._id
      if (!taskId) {
        throw new Error('Undefined task ID.')
      }
      const fetchedFocusTimer = await focusTimersApi.getFocusTimerByTaskId(taskId)
      setFocusTimerFormDefaultValues(taskId, fetchedFocusTimer)
      resetFocusTimerForm(taskId, fetchedFocusTimer)
      setRemainingTime(fetchedFocusTimer.remainingTime)
      focusTimerRef.reset()
      return fetchedFocusTimer
    },
    enabled: taskQuery.isSuccess
  })

  useEffect(() => {
    if (focusTimerQuery.isSuccess && focusTimerQuery.data) {
      setTimeSpent(focusTimerQuery.data.timeSpent)
    }
  }, [focusTimerQuery.isSuccess, focusTimerQuery.data])

  const focusTimerCreateMutation = useMutation({
    mutationKey: ['create-focus-timer', uid],
    mutationFn: async (data: CreateFocusTimerDto) => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      const createdFocusTimer = await focusTimersApi.createFocusTimer(data)
      await usersApi.setActiveFocusTimer(uid, createdFocusTimer._id!)
      return createdFocusTimer
    }
  })

  const focusTimerUpdateMutation = useMutation({
    mutationKey: ['update-focus-timer', uid],
    mutationFn: async (data: { focusTimerId: string; focusTimerData: CreateFocusTimerDto }) => {
      const focusTimerId = focusTimerQuery.data?._id
      if (!focusTimerId) {
        throw new Error('Undefined focus timer ID.')
      }
      await focusTimersApi.updateFocusTimer(data.focusTimerId, data.focusTimerData)
    }
  })

  const setActiveFocusTimerMutation = useMutation({
    mutationKey: ['active-focus-timer', uid],
    mutationFn: async (focusTimerId: string) => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      await usersApi.setActiveFocusTimer(uid, focusTimerId)
    }
  })

  const clearActiveFocusTimerMutation = useMutation({
    mutationKey: ['clear-active-focus-timer', uid],
    mutationFn: async () => {
      if (!uid) {
        throw new Error('Unauthorized user.')
      }
      await usersApi.clearActiveFocusTimer(uid)
    }
  })

  function onTick(time: number) {
    if (focusTimerQuery.data) {
      const focusTimerId = focusTimerQuery.data._id
      if (focusTimerId) {
        focusTimerUpdateMutation.mutate({
          focusTimerId,
          focusTimerData: {
            remainingTime: time,
            timeSpent: timeSpent + interval / 1000
          } as CreateFocusTimerDto
        })
      }
      setTimeSpent((prev) => prev + interval / 1000)
    }
  }

  function onComplete() {
    handleTimerPhaseChange()
  }

  const focusTimerRef = useTimer({
    duration: duration,
    initialRemainingTime: remainingTime,
    interval: interval,
    onTick: onTick,
    onComplete: onComplete,
    autoStart: timerIsRunning
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
    getValues
  } = useForm<CreateFocusTimerDto>({
    defaultValues: defaultValues || {
      userId: uid!,
      taskId: '',
      focusDuration: minFocusTime,
      breakDuration: minBreakTime,
      remainingTime: minFocusTime * timeMultipler,
      timeSpent: 0,
      isActive: false
    },
    mode: 'onChange'
  })

  const onSubmit: SubmitHandler<CreateFocusTimerDto> = async (data: CreateFocusTimerDto) => {
    try {
      // Ensure focusDuration and breakDuration are valid numbers
      if (isNaN(data.focusDuration) || isNaN(data.breakDuration)) {
        throw new Error('Focus duration or break duration is not a valid number')
      }

      setDuration(data.focusDuration * timeMultipler)
      setRemainingTime(data.focusDuration * timeMultipler)

      // Check if a focus timer with the given taskId exists
      const existingFocusTimer = focusTimerQuery.data

      if (existingFocusTimer) {
        const taskId = taskQuery.data?._id
        // Update the existing focus timer
        focusTimerUpdateMutation.mutate({
          focusTimerId: existingFocusTimer._id!,
          focusTimerData: {
            userId: uid!,
            taskId: taskId!,
            eventId: currentEventId,
            focusDuration: data.focusDuration * timeMultipler,
            breakDuration: data.breakDuration * timeMultipler,
            remainingTime: data.focusDuration * timeMultipler,
            isActive: false
          } as CreateFocusTimerDto
        })
        setTimeSpent(existingFocusTimer.timeSpent)
        toast({
          title: 'Focus Timer updated successfully.',
          description: 'Your focus timer has been updated.'
        })
      } else {
        // Create a new focus timer
        focusTimerCreateMutation.mutate({
          userId: uid!,
          taskId: taskQuery.data!._id!,
          eventId: currentEventId,
          focusDuration: data.focusDuration * timeMultipler,
          breakDuration: data.breakDuration * timeMultipler,
          remainingTime: data.focusDuration * timeMultipler,
          timeSpent: 0,
          isActive: false
        } as CreateFocusTimerDto)
        setTimeSpent(0)
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
    setActiveFocusTimerMutation.mutate(focusTimerQuery.data!._id!)
    if (focusTimerRef) {
      focusTimerRef.start()
      dispatch(setTimerIsRunning(true))
    }
  }

  const handleStartAndSubmit = async () => {
    try {
      const task = taskQuery.data
      if (!task) {
        throw new Error('Task not found.')
      }
      const existingFocusTimer = await focusTimersApi.getFocusTimerByTaskId(task!._id!)
      if (!existingFocusTimer) {
        await handleSubmit(onSubmit)()
      }
      handleResetTimer()
      handleStartTimer()
    } catch (error) {
      toast({
        title: 'Failed to start focus timer.',
        description: error instanceof Error ? error.message : 'An error occurred during focus timer start.'
      })
    }
  }

  const handlePauseTimer = async () => {
    clearActiveFocusTimerMutation.mutate()
    if (focusTimerRef) {
      focusTimerRef.stop()
      dispatch(setTimerIsRunning(false))
      toast({
        title: 'Focus session paused.',
        description: 'Focus timer paused.'
      })
    }
  }

  const handleResetTimer = () => {
    setKey((prevKey) => prevKey + 1)
    if (focusTimerRef) {
      focusTimerRef.reset()
    }
  }

  const handleResetAndSubmit = () => {
    handleResetTimer()
    handleSubmit(onSubmit)()
  }

  const handleTimerPhaseChange = () => {
    setIsFocusPhase((prev) => !prev)
    setCanMarkAsComplete(true)
    setKey((prevKey) => prevKey + 1)
  }

  useEffect(() => {
    focusTimerRef.reset()
    const formValues = getValues()
    setDuration(isFocusPhase ? formValues.focusDuration * timeMultipler : formValues.breakDuration * timeMultipler)
    setRemainingTime(isFocusPhase ? formValues.focusDuration * timeMultipler : formValues.breakDuration * timeMultipler)
    focusTimerRef.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusPhase])

  const playTimerFinishAudio = () => {
    const audio = new Audio(audioTimerFinish)
    audio.volume = 1
    audio.play()
  }

  const markTaskAsComplete = async () => {
    try {
      if (taskQuery.data) {
        taskUpdateMutation.mutate({
          taskId: taskQuery.data._id!,
          taskData: {
            status: 'C'
          } as UpdateTaskDto
        })
        toast({
          title: 'Task marked as complete.',
          description: 'Task has been marked as complete.'
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to mark task as complete.',
        description: error instanceof Error ? error.message : 'An error occurred during updating task.'
      })
    }
  }

  const canStartTimer: boolean = taskQuery.data === null ? false : taskQuery.data?.status === 'IP' ? true : false

  const timerDescription = timerIsRunning
    ? 'Timer is running'
    : canStartTimer
      ? 'You can start a timer session for this task'
      : `You can't start a timer session for this task`

  return (
    <div className='flex w-full gap-6'>
      {/* Task details */}
      <div className='flex w-[320px] flex-col gap-6 py-2'>
        {eventQuery.isLoading && taskQuery.isLoading && <LoadingIndicator />}

        {taskQuery.data && eventQuery.data && (
          <>
            {/* Priority and Status */}
            <div className='flex flex-row items-center gap-2'>
              <>
                <TaskBadge
                  label={taskPriorityLabels[taskQuery.data.priority]}
                  textColor={priorityColors[taskQuery.data.priority].textColor}
                  bgColor={priorityColors[taskQuery.data.priority].bgColor}
                />
                <TaskBadge
                  label={taskStatusLabels[taskQuery.data.status]}
                  textColor={statusColors[taskQuery.data.status].textColor}
                  bgColor={statusColors[taskQuery.data.status].bgColor}
                />
              </>
            </div>
            {/* Name */}
            <DialogHeader>
              <DialogTitle className='line-clamp-3'>{taskQuery.data.name}</DialogTitle>
              <DialogDescription className='line-clamp-4'>{taskQuery.data.description}</DialogDescription>
            </DialogHeader>
            {/* Start, end and deadline time */}
            <div className='flex flex-col'>
              <DateTimeField label='Start' date={eventQuery.data.start} />
              <div className='w-full pl-0'>
                <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: colors.text_secondary }} size='sm' />
              </div>
              <DateTimeField label='End' date={eventQuery.data.end} />
              <div className='w-full pl-0'>
                <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: colors.text_secondary }} size='sm' />
              </div>
              <DateTimeField label='Deadline' date={taskQuery.data.deadline} />
            </div>
          </>
        )}
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
        {focusTimerQuery.isLoading && <LoadingIndicator />}
        {focusTimerQuery.data && (
          <>
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
                      }}
                      disabled={timerIsRunning || !canStartTimer}
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
                      disabled={timerIsRunning || !canStartTimer}
                      className='col-span-3'
                    />
                  )}
                />
              </div>
            </div>
            <CountdownCircleTimer
              key={key}
              isPlaying={timerIsRunning}
              initialRemainingTime={remainingTime}
              duration={duration}
              colors={['#004777', '#F7B801', '#A30000']}
              colorsTime={[duration, duration / 2, 0]}
              onComplete={() => {
                playTimerFinishAudio()
                handlePauseTimer()
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
            <div className='flex w-full flex-col gap-4'>
              <div className='flex w-full justify-between gap-4'>
                <div className='w-full'>
                  {!timerIsRunning ? (
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
                <div className='w-full'>
                  <ButtonFullWidth
                    enabled={canStartTimer && !timerIsRunning}
                    text='Set Timer'
                    icon={faRefresh}
                    onClick={handleResetAndSubmit}
                    backgroundColor='#f00'
                  />
                </div>
              </div>
              <div className='w-full'>
                <ButtonFullWidth
                  enabled={canMarkAsComplete && canStartTimer && !timerIsRunning}
                  text='Mark Task as Complete'
                  icon={faCheck}
                  onClick={markTaskAsComplete}
                  backgroundColor='#5bb450'
                />
              </div>
            </div>
          </>
        )}
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
