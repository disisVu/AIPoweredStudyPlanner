import { colors } from '@/styles'

interface PageLabelProps {
  label: string
}

export function PageLabel({ label }: PageLabelProps) {
  return (
    <div className='ml-14 flex h-12 items-center'>
      <span className='pb-2 text-xl font-medium' style={{ color: colors.text_primary }}>
        {label}
      </span>
    </div>
  )
}
