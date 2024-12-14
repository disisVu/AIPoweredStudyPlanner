import { CalendarView } from '@/components/Calendar'
import { PageLabel } from '@/components/Text'

export function TaskSchedulingPage() {
  return (
    <div className='flex flex-col items-start gap-3'>
      <PageLabel label='Task Scheduling' />
      <CalendarView />
    </div>
  )
}
