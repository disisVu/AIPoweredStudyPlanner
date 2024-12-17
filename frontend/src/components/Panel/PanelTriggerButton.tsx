import { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const PanelTriggerButton = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CollapsibleTrigger asChild>
          <div
            ref={ref}
            className='flex h-10 w-10 cursor-pointer items-center justify-center gap-3 rounded-full bg-gray-200 px-3 hover:brightness-90'
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
        </CollapsibleTrigger>
      </TooltipTrigger>
      <TooltipContent side='bottom' align='start'>
        Open Task panel
      </TooltipContent>
    </Tooltip>
  )
})

PanelTriggerButton.displayName = 'PanelTriggerButton'
