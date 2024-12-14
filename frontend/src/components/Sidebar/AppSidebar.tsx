import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'
import { faCalendar, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { colors } from '@/styles'
import { SidebarMenuItemNavigate } from './SidebarMenuItemNavigate'

export function AppSidebar() {
  return (
    <Sidebar className='select-none px-4'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='my-2 text-sm font-medium' style={{ color: colors.text_secondary }}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItemNavigate label='Task Management' link='add-task' icon={faClipboardList} />
              <SidebarMenuItemNavigate label='Task Scheduling' link='scheduling' icon={faCalendar} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
