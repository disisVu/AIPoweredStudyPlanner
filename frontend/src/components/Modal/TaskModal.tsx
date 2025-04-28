import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Task } from '@/types/schemas'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { tasksApi } from '@/api/tasks.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DateTimePicker } from '@/components/Input'
import { CreateTaskDto, UpdateTaskDto } from '@/types/api/tasks'
import React, { useState } from 'react'
import { getUserCredentials } from '@/utils'

interface TaskModalProps {
  action: 'add' | 'update'
  initialTask?: Task
  onClose?: () => void
  triggerComponent: React.ReactNode
}

export function TaskModal({ action, initialTask, onClose, triggerComponent }: TaskModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { uid } = getUserCredentials()
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)

  const defaultValues: CreateTaskDto | UpdateTaskDto =
    action === 'add'
      ? {
          userId: uid || '',
          name: '',
          description: '',
          priority: 'M',
          status: 'T',
          estimatedTime: 1,
          deadline: new Date(),
          isDistributed: false
        }
      : {
          name: initialTask?.name || '',
          description: initialTask?.description || '',
          priority: initialTask?.priority || 'M',
          status: initialTask?.status || 'T',
          estimatedTime: initialTask?.estimatedTime || 1,
          deadline: new Date(initialTask?.deadline || new Date()),
          isDistributed: initialTask?.isDistributed || false
        }

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<CreateTaskDto | UpdateTaskDto>({
    defaultValues,
    mode: 'onChange'
  })

  const mutation = useMutation({
    mutationKey: action === 'add' ? ['createTask'] : ['updateTask'],
    mutationFn: (data: CreateTaskDto | UpdateTaskDto) => {
      if (action === 'add') {
        return tasksApi.createTask(data as CreateTaskDto)
      } else if (initialTask?._id) {
        return tasksApi.updateTask(initialTask._id, data as UpdateTaskDto)
      } else {
        throw new Error('Task ID is missing for update action.')
      }
    },
    onSuccess: () => {
      toast({
        title: action === 'add' ? 'Task created successfully.' : 'Task updated successfully.',
        description: action === 'add' ? 'Your task has been created.' : 'Your task has been updated.'
      })
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: false,
        refetchType: 'active'
      })
      setDialogOpen(false)
      onClose?.()
    },
    onError: (error: Error) => {
      toast({
        title: action === 'add' ? 'Failed to create task.' : 'Failed to update task.',
        description: error.message || 'An error occurred.'
      })
    }
  })

  const onSubmit: SubmitHandler<CreateTaskDto | UpdateTaskDto> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className='sm:max-w-[540px]'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className='mb-4'>
            <DialogTitle>{action === 'add' ? 'Create Task' : 'Edit Task'}</DialogTitle>
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
              <Button type='submit' disabled={!isValid || mutation.isPending}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
