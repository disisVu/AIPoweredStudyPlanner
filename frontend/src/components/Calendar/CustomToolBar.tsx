import { useState } from 'react'
import { ToolbarProps, View } from 'react-big-calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Direction } from '@/types/enum/direction'
import { colors } from '@/styles'

const views: View[] = ['day', 'week', 'month', 'agenda']

export function CustomToolbar<CalendarEvent extends object>({
  label,
  onNavigate,
  onView
}: ToolbarProps<CalendarEvent, object>) {
  const [currentView, setCurrentView] = useState<View>('month')

  const handleViewChange = (view: View) => {
    setCurrentView(view)
    onView(view) // Notify the parent about the view change
  }

  return (
    <div className='mb-4 flex h-10 justify-between'>
      <div className='flex h-full items-center gap-4'>
        <ToolBarButton label='Today' onClick={() => onNavigate('TODAY')} />
        <div className='flex gap-1'>
          <DayNavigateButton direction={Direction.Left} onClick={() => onNavigate('PREV')} currentView={currentView} />
          <DayNavigateButton direction={Direction.Right} onClick={() => onNavigate('NEXT')} currentView={currentView} />
        </div>
        <span className='text-xl'>{label}</span>
      </div>
      <div>
        <ToolBarButtonGroup views={views} onView={handleViewChange} />
      </div>
    </div>
  )
}

interface DayNavigateButtonProps {
  direction: Direction
  onClick: () => void
  currentView: View
}

export function DayNavigateButton({ direction, onClick, currentView }: DayNavigateButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={onClick}
          className='flex cursor-pointer items-center justify-center rounded-full bg-white p-2 text-sm hover:brightness-90'
        >
          <FontAwesomeIcon icon={direction === Direction.Left ? faChevronLeft : faChevronRight} />
        </div>
      </TooltipTrigger>
      <TooltipContent side='bottom' align='center' sideOffset={4}>
        {direction === Direction.Left ? 'Previous ' : 'Next '}
        {String(currentView)}
      </TooltipContent>
    </Tooltip>
  )
}

interface ToolBarButtonProps {
  label: string
  onClick?: () => void
}

export function ToolBarButton({ label, onClick = () => {} }: ToolBarButtonProps) {
  return (
    <div
      className='flex h-full min-w-20 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-6 hover:brightness-90'
      onClick={onClick}
    >
      <p className='h-auto text-sm font-medium'>{label}</p>
    </div>
  )
}

interface ToolBarButtonGroupProps {
  views: View[]
  onView: (view: View) => void
}

export function ToolBarButtonGroup({ views, onView }: ToolBarButtonGroupProps) {
  const [selectedView, setSelectedView] = useState<View>('month')

  const handleViewChange = (view: View) => {
    setSelectedView(view)
    onView(view)
  }

  return (
    <div
      role='radiogroup'
      aria-label='View Switcher'
      className='flex h-full rounded-full border border-gray-400 bg-white'
    >
      {views.map((view) => (
        <div
          key={view}
          role='radio'
          aria-checked={selectedView === view}
          tabIndex={selectedView === view ? 0 : -1}
          onClick={() => handleViewChange(view)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleViewChange(view)
          }}
          className={`flex h-full min-w-20 cursor-pointer items-center justify-center rounded-full border-none px-6 text-sm font-medium transition-all hover:border-none`}
          style={{
            backgroundColor: selectedView === view ? colors.primary : '',
            color: selectedView === view ? '#fff' : colors.text_primary
          }}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </div>
      ))}
    </div>
  )
}
