import { Outlet } from 'react-router-dom'
// import { NavBar } from '@/components/Header'
import { colors } from '@/styles'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar, CustomSidebarTrigger } from '@/components/Sidebar'

export function MainLayout() {
  return (
    <TooltipProvider>
      <div
        className='flex min-w-[100vw] flex-col items-center justify-start'
        style={{ backgroundColor: 'rgb(248, 250, 253)', color: colors.text_primary }}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className='flex w-full flex-col px-8 py-4'>
            <CustomSidebarTrigger />
            <Outlet />
          </main>
        </SidebarProvider>
        {/* <NavBar />
        <div className='w-full px-8 py-4'>
          <Outlet />
        </div> */}
      </div>
    </TooltipProvider>
  )
}
