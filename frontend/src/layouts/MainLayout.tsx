import { Outlet } from 'react-router-dom'
import { colors } from '@/styles'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Collapsible } from '@/components/ui/collapsible'
import { NavBar } from '../components/Header'

export function MainLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <div
        className='flex min-w-[100vw] flex-col items-center justify-start'
        style={{ backgroundColor: 'rgb(248, 250, 253)', color: colors.text_primary }}
      >
        <Collapsible className='w-full'>
          <NavBar />
          <Outlet />
        </Collapsible>
      </div>
    </TooltipProvider>
  )
}
