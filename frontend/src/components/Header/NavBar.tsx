import { useNavigate } from 'react-router-dom'
import { useHover } from '~/hooks'
import { colors } from '~/styles'

export function NavBar() {
  const navigate = useNavigate()

  const navigateToHome = () => {
    navigate('/')
  }

  return (
    <div
      style={{ width: '100vw', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      className='sticky top-0 z-20 flex h-16 flex-row items-center justify-between gap-4 bg-white py-3 pl-6 pr-10'
    >
      <span style={{ color: colors.primary }} className='cursor-pointer font-medium' onClick={navigateToHome}>
        AI-Powered Study Planner
      </span>
      <div className='flex flex-row items-center gap-10'>
        <NavBarHyperlink label='Temp' route='/' />
        {/* Logout button */}
        <div style={{ backgroundColor: colors.primary }} className='cursor-pointer rounded-md px-4 py-2'>
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
