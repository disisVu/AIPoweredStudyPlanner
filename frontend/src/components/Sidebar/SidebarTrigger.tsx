import { useSidebar } from '@/components/ui/sidebar'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function CustomSidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <div
      onClick={() => {
        toggleSidebar()
      }}
      className='absolute flex h-10 cursor-pointer items-center justify-center gap-3 rounded-full bg-gray-200 px-3 hover:bg-gray-300'
    >
      <FontAwesomeIcon icon={faBars} />
    </div>
  )
}
