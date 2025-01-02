import React, { useState, useEffect } from 'react'
import {
  getTotalTime,
  getDailyTime,
  getTaskStatus,
  TotalTimeResponse,
  DailyTimeResponse,
  TaskStatusResponse
} from './analyticsService'
import TotalTimeCard from './TotalTimeCard'
import DailyTimeChart from './DailyTimeChart'
import TaskStatusChart from './TaskStatusChart'
import { getUserCredentials as getUserCredentialsUtil } from '@/utils'

type AnalyticsDashboardProps = object

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = () => {
  const [totalTime, setTotalTime] = useState<TotalTimeResponse | null>(null)
  const [dailyTime, setDailyTime] = useState<DailyTimeResponse | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatusResponse | null>(null)
  const [uid, setUid] = useState<string>('')
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const initialize = async () => {
      const { accessToken, uid } = getUserCredentials()
      if (accessToken && uid) {
        setToken(accessToken)
        setUid(uid)
      } else {
        console.error('Failed to retrieve credentials. Please log in.')
        return
      }
    }
    initialize()
  }, [])

  useEffect(() => {
    if (!token || !uid) {
      getUserCredentials()
    } else {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (uid && token) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, token])

  const fetchData = async () => {
    try {
      const totalTimeData = await getTotalTime(uid, token)
      const dailyTimeData = await getDailyTime(uid, token)
      const taskStatusData = await getTaskStatus(uid, token)

      setTotalTime(totalTimeData)
      setDailyTime(dailyTimeData)
      setTaskStatus(taskStatusData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    }
  }

  const getUserCredentials = (): { accessToken: string | null; uid: string | null } => {
    try {
      const { accessToken, uid } = getUserCredentialsUtil()
      if (!accessToken) {
        console.error('Access token not found in stored user data.')
      }
      if (!uid) {
        console.error('UID not found in stored user data.')
      }
      return { accessToken, uid }
    } catch (error) {
      console.error('Error parsing user data from local storage:', error)
      return { accessToken: null, uid: null }
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
