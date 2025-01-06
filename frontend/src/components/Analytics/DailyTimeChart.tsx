import React from 'react'
import { Line } from 'react-chartjs-2'
import { DailyTimeResponse } from '@/types/api/analytics'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { colors } from '@/styles'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface DailyTimeChartProps {
  dailyTime: DailyTimeResponse
}

export const DailyTimeChart: React.FC<DailyTimeChartProps> = ({ dailyTime }) => {
  const data = {
    labels: Object.keys(dailyTime),
    datasets: [
      {
        label: 'Daily Time Spent (minutes)',
        data: Object.values(dailyTime),
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      }
    ]
  }

  return (
    <div
      style={{
        padding: '20px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'left'
      }}
    >
      <div className='flex items-center gap-x-4' style={{ color: colors.tertiary }}>
        <FontAwesomeIcon icon={faChartLine} size='2xl' />
        <span className='text-3xl font-medium'>Daily Time Spent</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '35px' }}>
        <Line data={data} height={500} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  )
}
