import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/Header'
import { colors } from '@/styles'

export function MainLayout() {
  return (
    <div style={{ color: colors.text_primary }} className='flex min-w-[100vw] flex-col items-center justify-start'>
      <NavBar />
      <div className='w-full px-10 py-10 lg:w-[1280px] lg:px-0'>
        <Outlet />
      </div>
    </div>
  )
}
