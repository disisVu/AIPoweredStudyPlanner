import { Outlet } from 'react-router-dom'
import { colors } from '@/styles'

export function AuthenticationLayout() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: colors.gradient
      }}
      className='flex items-center justify-center'
    >
      <Outlet />
    </div>
  )
}
