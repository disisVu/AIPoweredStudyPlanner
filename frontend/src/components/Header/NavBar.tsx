import { useNavigate } from 'react-router-dom'
import { useHover } from '@/hooks'
import { colors } from '@/styles'
import { signOutUser } from '@/utils'
import { useToast } from '@/hooks/use-toast'
import { PanelTriggerButton } from '@/components/Sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import logoPng from '@/assets/logo/logo.png'

export function NavBar() {
  const { toast } = useToast()

  const handleUserSignOut = async () => {
    try {
      const result = await signOutUser()
      if (result.success) {
        toast({
          title: 'Signed out successfully.',
          description: 'Proceeding to Login Page.'
        })
      } else {
        toast({
          title: 'Failed to sign out.',
          description: result.message
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to sign out.',
        description: 'An error occured during signing out.'
      })
      console.log(error)
    }
  }

  return (
    <div
      style={{ width: '100vw', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      className='sticky top-0 z-20 flex h-14 select-none flex-row items-center justify-between bg-white px-4 text-sm'
    >
      <div className='flex flex-row items-center gap-4'>
        <Tooltip>
          <TooltipTrigger asChild>
            <PanelTriggerButton />
          </TooltipTrigger>
          <TooltipContent side='bottom' align='center'>
            Open Task Panel
          </TooltipContent>
        </Tooltip>
        <div className='flex items-center gap-2'>
          <img src={logoPng} className='h-8' />
          <span className='text-xl font-medium' style={{ color: colors.primary }}>
            AI-Powered Study Planner
          </span>
        </div>
      </div>
      <div className='flex flex-row items-center gap-6'>
        <NavBarHyperlink label='Task Management' route='/add-task' />
        <NavBarHyperlink label='Scheduling' route='/scheduling' />
        {/* Logout button */}
        <div
          style={{ backgroundColor: colors.primary }}
          className='cursor-pointer rounded-full px-6 py-2'
          onClick={() => {
            handleUserSignOut()
          }}
        >
          <span className='font-medium text-white'>Log Out</span>
        </div>
      </div>
    </div>
  )
}

interface NavBarHyperlinkProps {
  label: string
  route: string
}

function NavBarHyperlink({ label, route }: NavBarHyperlinkProps) {
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
