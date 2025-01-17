import { formatDate, formatTime } from '@/utils'
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { colors } from '@/styles'

interface DateTimeBadgeProps {
  date: Date
}

export function DateTimeBadge({ date }: DateTimeBadgeProps) {
  return (
    <div
      className={`flex ${date ? 'justify-center' : 'justify-start px-4'} items-center gap-4 rounded-lg bg-slate-200 py-2 text-[15px]`}
      style={{ color: colors.text_primary }}
    >
      {date ? (
        <>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faCalendar} className='mb-[1px]' style={{ color: colors.text_secondary }} />
            <span>{formatDate(date)}</span>
          </div>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faClock} style={{ color: colors.text_secondary }} />
            <span>{formatTime(date)}</span>
          </div>
        </>
      ) : (
        <div className='flex items-center gap-2'>
          <span>null</span>
        </div>
      )}
    </div>
  )
}
