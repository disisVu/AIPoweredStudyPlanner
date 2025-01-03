import { Button } from '@/components/ui/button'
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateTaskDto } from '@/types/api/tasks'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { tasksApi } from '@/api/tasks.api'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { updateTask } from '@/store/reducers/taskSlice'
import { Task } from '@/types/schemas'
import { DateTimePicker } from '@/components/Input'

interface EditTaskModalProps {
  initialTask: Task
}

export function EditTaskModal({ initialTask }: EditTaskModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const defaultValues: UpdateTaskDto = {
    name: initialTask.name,
    description: initialTask.description,
    priority: initialTask.priority,
    status: initialTask.status,
    estimatedTime: initialTask.estimatedTime,
    deadline: new Date(initialTask.deadline),
    isDistributed: initialTask.isDistributed
  }

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<UpdateTaskDto>({
    defaultValues,
    mode: 'onChange'
  })

  const onSubmit: SubmitHandler<UpdateTaskDto> = async (data: UpdateTaskDto) => {
    try {
      const updatedTask = await tasksApi.updateTask(initialTask._id!, {
        ...data,
        estimatedTime: data.estimatedTime * 60
      })
      dispatch(updateTask(updatedTask))
      toast({
        title: 'Task updated successfully.',
        description: 'Your task has been updated.'
      })
    } catch (error) {
      toast({
        title: 'Failed to update task.',
        description: 'An error occured while updating task.'
      })
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader className='mb-4'>
        <DialogTitle>Edit Task</DialogTitle>
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
