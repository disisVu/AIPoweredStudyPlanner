import { Loader } from '@/components/Indicator'
import { colors } from '@/styles/index'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ButtonFullWidthProps {
  enabled: boolean
  text: string
  onClick: () => void
  isLoading?: boolean
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  icon?: IconDefinition
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
  icon,
  startAdornment,
  endAdornment
}: ButtonFullWidthProps) {
  return (
    <div
      className={`${enabled ? 'cursor-pointer hover:shadow-md hover:brightness-95' : ''} flex max-h-12 w-full items-center justify-center rounded-xl px-3 py-3`}
      style={{
        backgroundColor: enabled ? backgroundColor : colors.button_secondary,
        color: enabled ? textColor : colors.text_primary,
        border: `1px solid ${borderColor}`
      }}
      onClick={
        enabled
          ? () => {
              onClick()
            }
          : () => {}
      }
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className='grid w-full grid-cols-12'>
          <div className='col-span-1 max-w-fit'>{startAdornment && <img src={startAdornment} alt='' />}</div>
          <div className='col-span-10 flex items-center justify-center gap-2'>
            {icon && <FontAwesomeIcon icon={icon} size='sm' className='pb-[2px]' />}
            <span className='text-center text-sm font-medium'>{text}</span>
          </div>
          <div className='col-span-1'>{startAdornment && <img src={endAdornment} alt='' />}</div>
        </div>
      )}
    </div>
  )
}
