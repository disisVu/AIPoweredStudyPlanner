import { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { CollapsibleTrigger } from '@/components/ui/collapsible'

export const PanelTriggerButton = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <CollapsibleTrigger asChild>
      <div
        ref={ref}
        className='flex h-10 w-10 cursor-pointer items-center justify-center gap-3 rounded-full bg-gray-200 px-3 hover:bg-gray-300'
      >
        <FontAwesomeIcon icon={faBars} />
      </div>
    </CollapsibleTrigger>
  )
})

PanelTriggerButton.displayName = 'PanelTriggerButton'
