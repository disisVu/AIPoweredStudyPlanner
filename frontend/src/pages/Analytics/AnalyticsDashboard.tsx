import React, { useEffect, useState } from 'react'
import { analyticsApi } from '@/api/analytics.api'
import { TotalTimeResponse, DailyTimeResponse, TaskStatusResponse } from '@/types/api/analytics'
import { getUserCredentials } from '@/utils/auth'
import { DailyTimeChart, TaskStatusChart, TotalTimeCard } from '@/components/Analytics'

export const AnalyticsDashboard: React.FC = () => {
  const [totalTime, setTotalTime] = useState<TotalTimeResponse | null>(null)
  const [dailyTime, setDailyTime] = useState<DailyTimeResponse | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatusResponse | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const { accessToken, uid } = getUserCredentials()

    if (!uid || !accessToken) {
      return
    }

    setUid(uid)
    setToken(accessToken)
  }, [])

  useEffect(() => {
    if (uid && token) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, token])

  const fetchData = async () => {
    try {
      const totalTimeData = await analyticsApi.getTotalTime(uid!, token!)
      const dailyTimeData = await analyticsApi.getDailyTime(uid!, token!)
      const taskStatusData = await analyticsApi.getTaskStatus(uid!, token!)

      setTotalTime(totalTimeData)
      setDailyTime(dailyTimeData)
      setTaskStatus(taskStatusData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    }
  }

  return (
    <div className='flex min-h-[calc(100vh-56px)] w-full justify-center bg-blue-100 px-12 py-6'>
      <div className='grid w-full grid-cols-12 gap-x-4'>
        <div className='col-span-4 flex flex-col gap-4'>
          <div className='h-[30%] max-h-full w-full rounded-xl border border-gray-200 bg-white shadow-sm'>
            {totalTime && <TotalTimeCard totalTime={totalTime} />}
          </div>
          <div className='h-[70%] max-h-full w-full rounded-xl border border-gray-200 bg-white shadow-sm'>
            {taskStatus && <TaskStatusChart taskStatus={taskStatus} />}
          </div>
        </div>
        <div className='col-span-8 flex h-full flex-col gap-4'>
          <div className='h-full rounded-xl border border-gray-200 bg-white shadow-sm'>
            {dailyTime && <DailyTimeChart dailyTime={dailyTime} />}
          </div>
        </div>
      </div>
    </div>
  )
}
