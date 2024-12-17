import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { colors } from '@/styles'
import { ButtonFullWidth } from '@/components/Button'
import { signOutUser } from '@/utils'
import { useToast } from '@/hooks/use-toast'

interface DefaultAvatarProps {
  userData: { displayName: string; email: string }
}

export function DefaultAvatar({ userData }: DefaultAvatarProps) {
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
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div
              className='flex cursor-pointer items-center justify-center rounded-full border-4 border-gray-300 bg-gray-200'
              style={{
                width: '38px',
                height: '38px'
              }}
            >
              <FontAwesomeIcon icon={faUser} size='lg' style={{ color: 'gray' }} />
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom' align='end'>
          <div className='flex flex-col gap-1 rounded-md'>
            <span className='font-semibold'>User Account</span>
            <span className='text-gray-200'>{userData.displayName}</span>
            <span className='text-gray-200'>{userData.email}</span>
          </div>
        </TooltipContent>
        <PopoverContent side='bottom' align='end' sideOffset={8} className='rounded-3xl bg-slate-200'>
          <div className='flex flex-col items-center gap-4 text-center' style={{ color: colors.text_primary }}>
            <span className='text-sm font-medium'>{userData.email}</span>
            <div className='flex flex-col items-center gap-2'>
              <div
                className='flex cursor-pointer items-center justify-center rounded-full border-4 border-gray-300 bg-gray-200'
                style={{
                  width: '80px',
                  height: '80px'
                }}
              >
                <FontAwesomeIcon icon={faUser} size='3x' style={{ color: 'gray' }} />
              </div>
              <span className='text-2xl'>Hi, {userData.displayName}!</span>
            </div>
            <ButtonFullWidth
              enabled={true}
              text='Sign out'
              onClick={() => handleUserSignOut()}
              textColor={colors.text_primary}
              backgroundColor='#fff'
            />
          </div>
        </PopoverContent>
      </Tooltip>
    </Popover>
  )
}
