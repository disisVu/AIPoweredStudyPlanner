import { useNavigate } from 'react-router-dom'
import { useHover } from '@/hooks'
import { colors } from '@/styles'
import { signOutUser } from '@/utils'
import { useToast } from '@/hooks/use-toast'

export function NavBar() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const navigateToHome = () => {
    navigate('/')
  }

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
      className='sticky top-0 z-20 flex h-12 flex-row items-center justify-between gap-4 bg-white px-8 py-3 text-sm'
    >
      <span style={{ color: colors.primary }} className='cursor-pointer text-base font-medium' onClick={navigateToHome}>
        AI-Powered Study Planner
      </span>
      <div className='flex flex-row items-center gap-10'>
        <NavBarHyperlink label='Temp' route='/' />
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
      style={{ color: isHovered ? colors.primary : colors.text_secondary }}
      className='cursor-pointer font-medium'
      onClick={navigateToRoute}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
    </span>
  )
}
