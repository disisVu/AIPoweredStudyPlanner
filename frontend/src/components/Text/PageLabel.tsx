import { colors } from '@/styles'

interface PageLabelProps {
  label: string
}

export function PageLabel({ label }: PageLabelProps) {
  return (
    <div className='flex items-center'>
      <span className='text-xl font-medium' style={{ color: colors.text_primary }}>
        {label}
      </span>
    </div>
  )
}
