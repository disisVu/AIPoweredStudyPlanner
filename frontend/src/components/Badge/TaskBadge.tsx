interface TaskBadgeProps {
  label: string
  textColor: string
  bgColor: string
}

export function TaskBadge({ label, textColor, bgColor }: TaskBadgeProps) {
  return (
    <div
      className='flex items-center justify-center rounded-sm px-2'
      style={{ color: textColor, backgroundColor: bgColor }}
    >
      <span className='font-medium' style={{ fontSize: '12px' }}>
        {label}
      </span>
    </div>
  )
}
