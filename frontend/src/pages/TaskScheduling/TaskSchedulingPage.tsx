import { CalendarView } from '@/components/Calendar'
import { CollapsibleContent } from '@/components/ui/collapsible'
import { TaskPanel } from '@/components/Panel'

export function TaskSchedulingPage() {
  return (
    <div className='flex w-full flex-row pr-4'>
      <CollapsibleContent className='bg-slate-100 shadow-md'>
        <TaskPanel />
      </CollapsibleContent>
      <div className='my-4 w-full pr-6'>
        <CalendarView />
      </div>
    </div>
  )
}
