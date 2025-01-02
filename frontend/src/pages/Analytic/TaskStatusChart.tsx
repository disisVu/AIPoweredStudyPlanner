import React from 'react'
import { Pie } from 'react-chartjs-2'
import { TaskStatusResponse } from './analyticsService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { colors } from '@/styles'

ChartJS.register(ArcElement, Tooltip, Legend)

interface TaskStatusChartProps {
  taskStatus: TaskStatusResponse
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ taskStatus }) => {
  const data = {
    labels: Object.keys(taskStatus),
    datasets: [
      {
        label: 'Tasks by Status',
        data: Object.values(taskStatus),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'left'
      }}
    >
      {/* Title */}
      <div className='flex items-center gap-x-4' style={{ color: colors.tertiary }}>
        <FontAwesomeIcon icon={faChartPie} size='2xl' />
        <span className='text-3xl font-medium'>Task by status</span>
      </div>

      {/* Center the Pie chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '35px' }}>
        <Pie data={data} height={350} width={350} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  )
}

export default TaskStatusChart
