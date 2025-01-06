import React from 'react'
import { TotalTimeResponse } from '@/types/api/analytics'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { colors } from '@/styles'
import { faClockFour } from '@fortawesome/free-regular-svg-icons'

interface TotalTimeCardProps {
  totalTime: TotalTimeResponse
}

export const TotalTimeCard: React.FC<TotalTimeCardProps> = ({ totalTime }) => {
  const { total_time_spent, total_estimated_time } = totalTime

  const spentMinutes = Math.floor(total_time_spent / 60)
  const spentSeconds = total_time_spent % 60

  // Convert total_estimated_time to minutes and seconds
  const estimatedMinutes = Math.floor(total_estimated_time / 60)
  const estimatedSeconds = total_estimated_time % 60

  return (
    <div
      style={{
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'left'
      }}
    >
      <div className='flex items-center gap-x-4' style={{ color: colors.tertiary }}>
        <FontAwesomeIcon icon={faClockFour} size='2xl' />
        <span className='text-3xl font-medium'>Total Time Spent</span>
      </div>

      <p
        style={{
          paddingTop: '28px',
          marginBottom: '10px',
          paddingLeft: '10px'
        }}
      >
        <strong>Time Spent:</strong> {spentMinutes} minutes {spentSeconds} seconds
      </p>

      <p
        style={{
          paddingLeft: '10px'
        }}
      >
        <strong>Estimated Time:</strong> {estimatedMinutes} minutes {estimatedSeconds} seconds
      </p>
    </div>
  )
}
