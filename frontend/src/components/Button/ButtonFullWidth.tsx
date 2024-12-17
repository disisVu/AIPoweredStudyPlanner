import { Loader } from '@/components/Indicator'
import { colors } from '@/styles/index'

interface ButtonFullWidthProps {
  enabled: boolean
  text: string
  onClick: () => void
  isLoading?: boolean
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  startAdornment?: string
  endAdornment?: string
}

export function ButtonFullWidth({
  enabled,
  text,
  onClick,
  isLoading = false,
  backgroundColor = colors.primary,
  textColor = 'white',
  borderColor = 'none',
  startAdornment,
  endAdornment
}: ButtonFullWidthProps) {
  return (
    <div
      className={`${enabled ? 'cursor-pointer' : ''} flex max-h-12 w-full items-center justify-center rounded-xl px-3 py-3 hover:shadow-md hover:brightness-95`}
      style={{
        backgroundColor: enabled ? backgroundColor : colors.button_secondary,
        color: enabled ? textColor : colors.text_primary,
        border: `1px solid ${borderColor}`
      }}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className='grid w-full grid-cols-12'>
          <div className='col-span-1 max-w-fit'>{startAdornment && <img src={startAdornment} alt='' />}</div>
          <div className='col-span-10 flex items-center justify-center'>
            <span className='text-center text-sm font-medium'>{text}</span>
          </div>
          <div className='col-span-1'>{startAdornment && <img src={endAdornment} alt='' />}</div>
        </div>
      )}
    </div>
  )
}
