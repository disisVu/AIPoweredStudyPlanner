import { Loader } from '@/components/Indicator'
import { colors } from '@/styles/index'

interface ButtonFullWidthProps {
  enabled: boolean
  text: string
  onClick: () => void
  isLoading?: boolean
}

export function ButtonFullWidth({ enabled, text, onClick, isLoading = false }: ButtonFullWidthProps) {
  return (
    <div
      className={`${enabled ? 'cursor-pointer' : ''} mb-5 flex max-h-12 w-full items-center justify-center rounded-xl py-3 hover:brightness-105`}
      style={{
        backgroundColor: enabled ? colors.primary : colors.button_secondary,
        color: enabled ? 'white' : colors.text_primary
      }}
      onClick={onClick}
    >
      {isLoading ? <Loader /> : <span className='text-sm font-semibold'>{text}</span>}
    </div>
  )
}
