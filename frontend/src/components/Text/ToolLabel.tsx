import { colors } from '@/styles'

interface ToolLabelProps {
  label: string
}

export function ToolLabel({ label }: ToolLabelProps) {
  return (
    <div className='flex items-center'>
      <span className='text-sm font-medium' style={{ color: colors.text_secondary }}>
        {label}
      </span>
    </div>
  )
}
