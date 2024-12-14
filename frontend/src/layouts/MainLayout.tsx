import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/Header'
import { colors } from '@/styles'
import { TooltipProvider } from '@/components/ui/tooltip'

export function MainLayout() {
  return (
    <TooltipProvider>
      <div
        className='flex min-w-[100vw] flex-col items-center justify-start'
        style={{ backgroundColor: 'rgb(248, 250, 253)', color: colors.text_primary }}
      >
        <NavBar />
        <div className='w-full px-8 py-4'>
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  )
}
