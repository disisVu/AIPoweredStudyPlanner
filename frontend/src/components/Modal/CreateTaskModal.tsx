import { Button } from '@/components/ui/button'
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateTaskDto } from '@/types/api/tasks'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { tasksApi } from '@/api/tasks.api'
import { getUserCredentials } from '@/utils'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { addTask } from '@/store/reducers/taskSlice'
import { DateTimePicker } from '@/components/Input'

export function CreateTaskModal() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [uid, setUid] = useState<string | undefined>()

  // Fetch tasks by user ID
  useEffect(() => {
    const { uid } = getUserCredentials()

    // If uid is null or not found, stop the process and show an error
    if (!uid) {
      return
    }

    setUid(uid)
  }, [])

  const defaultValues: CreateTaskDto = {
    userId: '',
    name: '',
    description: '',
    priority: 'M',
    status: 'T',
    estimatedTime: 1,
    deadline: new Date(),
    isDistributed: false
  }

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<CreateTaskDto>({
    defaultValues,
    mode: 'onChange'
  })

  const onSubmit: SubmitHandler<CreateTaskDto> = async (data: CreateTaskDto) => {
    try {
      const newTask = await tasksApi.createTask({
        ...data,
        userId: uid!,
        estimatedTime: data.estimatedTime * 60
      })
      dispatch(addTask(newTask))
      toast({
        title: 'Task created successfully.',
        description: 'Your task has been created.'
      })
    } catch (error) {
      toast({
        title: 'Failed to create task.',
        description: 'An error occured during task creation.'
      })
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader className='mb-4'>
        <DialogTitle>Create Task</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        {/* Input task name */}
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='name' className='text-right'>
            Name
          </Label>
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Required',
              minLength: { value: 1, message: 'Must contain at least 1 character.' }
            }}
            render={({ field: { value, onChange } }) => (
              <Input id='name' value={value} onChange={onChange} className='col-span-3' />
            )}
          />
        </div>
        {/* Input description */}
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='description' className='text-right'>
            Description
          </Label>
          <Controller
            name='description'
            control={control}
            rules={{
              required: 'Required',
              minLength: { value: 1, message: 'Must contain at least 1 character.' }
            }}
            render={({ field: { value, onChange } }) => (
              <Textarea rows={2} id='description' value={value} onChange={onChange} className='col-span-3' />
            )}
          />
        </div>
        {/* Select priority */}
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='priority' className='text-right'>
            Priority
          </Label>
          <Controller
            name='priority'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='H'>High</SelectItem>
                    <SelectItem value='M'>Medium</SelectItem>
                    <SelectItem value='L'>Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Input estimated time */}
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='estimatedTime' className='text-right'>
            Estimated Time (minutes)
          </Label>
          <Controller
            name='estimatedTime'
            control={control}
            rules={{
              required: 'Required',
              min: { value: 1, message: 'Value must be at least 1' }
            }}
            render={({ field: { value, onChange } }) => (
              <Input
                type='number'
                id='estimatedTime'
                value={value}
                min={1}
                onChange={(e) => onChange(Number(e.target.value))}
                className='col-span-3'
              />
            )}
          />
        </div>
        {/* Select deadline */}
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='deadline' className='text-right'>
            Deadline
          </Label>
          <div className='col-span-3'>
            <Controller
              name='deadline'
              control={control}
              rules={{
                required: 'Required'
              }}
              render={({ field: { onChange, value } }) => (
                <DateTimePicker selectedDate={value} onDateChange={onChange} />
              )}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='submit' disabled={!isValid}>
            Save changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  )
}
