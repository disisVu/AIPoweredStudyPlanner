import React from 'react'

interface PrimaryModalProps {
  isOpen: boolean
  children: React.ReactNode
}

export function PrimaryModal({ isOpen, children }: PrimaryModalProps) {
  if (!isOpen) return null

  return (
    <div className='flex w-full flex-col items-center justify-center rounded-xl bg-white p-10 py-16 shadow-lg sm:w-[640px] sm:p-20'>
      {children}
    </div>
  )
}
