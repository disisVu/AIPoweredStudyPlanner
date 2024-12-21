import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SearchBar } from '@/components/Input'
import { ToolLabel } from '@/components/Text'
import { colors } from '@/styles'
import { FilterTaskDto } from '@/types/api/tasks'

interface TaskFilterModuleProps {
  onFilterChange: (filters: FilterTaskDto) => void
  onClearFilters: () => void
}

export function TaskFilterModule({ onFilterChange, onClearFilters }: TaskFilterModuleProps) {
  const defaultValues: FilterTaskDto = {
    name: undefined,
    priority: undefined,
    status: undefined,
    deadline: undefined
  }

  const { control, handleSubmit, reset } = useForm<FilterTaskDto>({
    defaultValues
  })

  const onSubmit: SubmitHandler<FilterTaskDto> = async (data: FilterTaskDto) => {
    onFilterChange({
      name: data.name,
      priority: data.priority,
      status: data.status,
      deadline: data.deadline
    })
  }

  const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div
        className='flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 pb-5 pt-3 shadow-sm'
        style={{ color: colors.text_primary }}
      >
        <div className='flex w-full flex-col gap-1 rounded-t-md'>
          <ToolLabel label='Filters' />
          <div className='grid w-full grid-cols-12 gap-x-4'>
            <div className='col-span-10'>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SearchBar value={value || ''} onChange={onChange} placeholder='Filter tasks by name' />
                )}
              />
            </div>
            <div className='col-span-2'>
              <div
                className='flex h-full w-full cursor-pointer items-center justify-center rounded-md hover:brightness-110'
                style={{ backgroundColor: colors.primary }}
                onClick={handleSubmit(onSubmit)}
              >
                <span className='text-sm font-medium text-white'>Apply Filters</span>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4'>
          {/* Select Filter Criterias */}
          <div className='col-span-10 grid grid-cols-12 gap-4'>
            {/* Priority */}
            <div className='col-span-4 flex flex-col gap-1'>
              <ToolLabel label='Priority' />
              <Controller
                name='priority'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className='w-full'>
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
            {/* Status */}
            <div className='col-span-4 flex flex-col gap-1'>
              <ToolLabel label='Status' />
              <Controller
                name='status'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='T'>Todo</SelectItem>
                        <SelectItem value='IP'>In Progress</SelectItem>
                        <SelectItem value='C'>Completed</SelectItem>
                        <SelectItem value='E'>Expired</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* Deadline Date */}
            <div className='col-span-4 flex flex-col gap-1'>
              <ToolLabel label='Deadline' />
              <Controller
                name='deadline'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <div className='flex h-9 w-full cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-200 px-3 text-sm font-medium shadow-sm outline-1 outline-indigo-500 hover:outline'>
                        <input
                          type='text'
                          value={value ? value.toLocaleDateString() : ''}
                          readOnly
                          placeholder='MM:DD:YYYY'
                          className='w-full cursor-pointer focus:outline-none'
                        />
                        <FontAwesomeIcon icon={faCalendar} />
                        <PopoverContent className='w-auto p-0' align='end'>
                          <Calendar
                            mode='single'
                            selected={value}
                            onSelect={(date) => {
                              onChange(date || new Date())
                              setCalendarOpen(false)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </div>
                    </PopoverTrigger>
                  </Popover>
                )}
              />
            </div>
          </div>
          <div className='col-span-2 pt-6'>
            <div
              className='flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-red-500 hover:brightness-110'
              onClick={() => {
                reset(defaultValues)
                onClearFilters()
              }}
            >
              <span className='text-sm font-medium text-white'>Clear Filters</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
