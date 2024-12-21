import { useLocation, useNavigate } from 'react-router-dom'
import { useHover } from '@/hooks'
import { colors } from '@/styles'
import { getStoredUser } from '@/utils'
import { PanelTriggerButton } from '@/components/Panel'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import logoPng from '@/assets/logo/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { DefaultAvatar } from '@/components/Avatar'

export function NavBar() {
  const userData = getStoredUser() || { displayName: '', email: '' }
  const navigate = useNavigate()

  const navigateToHomepage = () => {
    navigate('/')
  }

  return (
    <div
      style={{ width: '100vw', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      className='sticky top-0 z-20 flex h-14 select-none flex-row items-center justify-between bg-white px-4 text-sm'
    >
      <div className='flex flex-row items-center gap-4'>
        <PanelTriggerButton />
        <div className='flex cursor-pointer items-center gap-2' onClick={navigateToHomepage}>
          <img src={logoPng} className='h-8' />
          <span className='text-xl font-medium' style={{ color: colors.primary }}>
            AI-Powered Study Planner
          </span>
        </div>
      </div>
      <div className='flex flex-row items-center gap-4'>
        <PageSwitchButtons />
        {/* User button */}
        <DefaultAvatar userData={userData} />
      </div>
    </div>
  )
}

interface NavBarHyperlinkProps {
  label: string
  route: string
}

export function NavBarHyperlink({ label, route }: NavBarHyperlinkProps) {
  const navigate = useNavigate()
  const { isHovered, onMouseEnter, onMouseLeave } = useHover()

  const navigateToRoute = () => {
    navigate(route)
  }

  return (
    <span
      style={{ color: isHovered ? colors.text_primary : colors.text_secondary }}
      className='cursor-pointer font-medium'
      onClick={navigateToRoute}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
    </span>
  )
}

function PageSwitchButtons() {
  const navigate = useNavigate()
  const location = useLocation()
  const isCurrentRoute = (path: string) => location.pathname === path

  return (
    <div className='flex flex-row'>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className='cursor-pointer rounded-l-full border border-gray-400 py-2 pl-5 pr-4 hover:brightness-90'
            style={{
              backgroundColor: isCurrentRoute('/task-scheduling') || isCurrentRoute('/') ? '#c2e7ff' : '#fff'
            }}
            onClick={() => navigate('/task-scheduling')}
          >
            <FontAwesomeIcon icon={faCalendar} size='lg' />
          </div>
        </TooltipTrigger>
        <TooltipContent side='bottom' align='center'>
          Switch to Calendar
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className='cursor-pointer rounded-r-full border border-gray-400 border-l-transparent py-2 pl-4 pr-5 hover:brightness-90'
            style={{
              backgroundColor: isCurrentRoute('/task-management') ? '#c2e7ff' : '#fff'
            }}
            onClick={() => navigate('/task-management')}
          >
            <FontAwesomeIcon icon={faCircleCheck} size='lg' />
          </div>
        </TooltipTrigger>
        <TooltipContent side='bottom' align='center'>
          Switch to Tasks
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
