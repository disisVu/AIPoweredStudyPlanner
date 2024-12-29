import { format } from 'date-fns'
import { stringOrDate } from 'react-big-calendar'

export function convertToDate(input: stringOrDate): Date {
  if (input instanceof Date) {
    return input // Already a Date object, no conversion needed
  }

  if (typeof input === 'string') {
    const date = new Date(input)
    if (!isNaN(date.getTime())) {
      return date // Successfully parsed ISO date string
    }
  }

  throw new Error('Invalid stringOrDate value: unable to convert to Date')
}

export function formatDate(date: Date): string {
  return date ? format(date, 'dd MMM yyyy') : 'null'
}

export function formatDateWithTime(date: Date): string {
  return date ? format(date, 'dd MMM yyyy, hh:mm a') : 'null'
}

export function formatTime(date: Date): string {
  return date ? format(date, 'hh:mm a') : 'null'
}

export const formatFocusTimer = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [hrs, mins, secs].map((val) => String(val).padStart(2, '0')).join(':')
}
