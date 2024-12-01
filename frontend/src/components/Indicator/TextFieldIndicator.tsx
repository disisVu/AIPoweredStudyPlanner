import { colors } from '@/styles'

interface TextFieldIndicatorProps {
  indicator: string
  color?: string
}

export function TextFieldIndicator({ indicator, color = colors.error }: TextFieldIndicatorProps) {
  return (
    <span className='ml-3 min-h-4 text-xs' style={{ color: color }}>
      {indicator}
    </span>
  )
}
