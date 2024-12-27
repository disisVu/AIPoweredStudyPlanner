import { Navigate, Outlet } from 'react-router-dom'
import { colors } from '@/styles'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Collapsible } from '@/components/ui/collapsible'
import { NavBar } from '@/components/Header'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export function MainLayout() {
  const timerIsRunning = useSelector((state: RootState) => state.session.timerIsRunning)

  if (timerIsRunning && location.pathname !== '/task-scheduling') {
    return <Navigate to='/task-scheduling' replace />
  }

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
