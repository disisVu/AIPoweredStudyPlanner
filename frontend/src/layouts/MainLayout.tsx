import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { colors } from '@/styles'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Collapsible } from '@/components/ui/collapsible'
import { NavBar } from '@/components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { usersApi } from '@/api/users.api'
import { setCurrentEventId, setTimerIsRunning } from '@/store/reducers/sessionSlice'
import { getUserCredentials } from '@/utils'

export function MainLayout() {
  const dispatch = useDispatch()
  const timerIsRunning = useSelector((state: RootState) => state.session.timerIsRunning)

  useEffect(() => {
    const fetchActiveFocusTimer = async () => {
      try {
        const { uid } = getUserCredentials()
        if (uid) {
          const activeFocusTimer = await usersApi.getActiveFocusTimer(uid)
          if (activeFocusTimer) {
            dispatch(setTimerIsRunning(true))
            dispatch(setCurrentEventId(activeFocusTimer.eventId))
          } else {
            console.log('false')
            dispatch(setTimerIsRunning(false))
          }
        }
      } catch (error) {
        console.error('Failed to fetch active focus timer:', error)
      }
    }

    fetchActiveFocusTimer()
  }, [dispatch])

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
