import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { useHover } from '@/hooks'
import { colors } from '@/styles'

interface SidebarMenuItemNavigateProps {
  label: string
  link: string
  icon: IconDefinition
}

export function SidebarMenuItemNavigate({ label, link, icon }: SidebarMenuItemNavigateProps) {
  const navigate = useNavigate()
  const location = useLocation() // Get the current location (URL)

  // Check if the current path matches the link for this item
  const isActive = location.pathname === `/${link}`

  const handleNavigate = () => {
    navigate(`/${link}`)
  }

  const { isHovered, onMouseEnter, onMouseLeave } = useHover()

  return (
    <SidebarMenuItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <SidebarMenuButton asChild>
        <div
          className='flex cursor-pointer items-center gap-3'
          style={{
            color: isActive ? colors.primary : isHovered ? colors.primary : colors.text_secondary
          }}
          onClick={handleNavigate}
        >
          <FontAwesomeIcon icon={icon} size='2x' className='pb-1' />
          <span className='text-center font-medium'>{label}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
