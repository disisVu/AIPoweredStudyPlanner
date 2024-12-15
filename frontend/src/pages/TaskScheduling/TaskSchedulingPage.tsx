import { useState } from 'react'
import { CalendarView } from '@/components/Calendar'
import { CollapsibleContent } from '@/components/ui/collapsible'
import { TaskPanel } from '@/components/Panel'
import { Event } from '@/components/Calendar/event.type'

export function TaskSchedulingPage() {
  const [draggedEvent, setDraggedEvent] = useState<Event | 'undroppable' | undefined>()

  return (
    <div className='flex w-full flex-row pr-4'>
      <CollapsibleContent className='bg-slate-100 shadow-md'>
        <TaskPanel setDraggedEvent={setDraggedEvent} />
      </CollapsibleContent>
      <div className='my-4 w-full pr-6'>
        <CalendarView draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent} />
      </div>
    </div>
  )
}
