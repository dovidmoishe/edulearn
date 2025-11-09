"use client"
import { useEffect } from 'react'

export default function HMRErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      
      if (
        error?.message?.includes('unrecognized HMR message') ||
        error?.message?.includes('HMR message') ||
        (typeof error === 'string' && error.includes('HMR'))
      ) {
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]?.message || args[0] || ''
      if (
        typeof message === 'string' &&
        (message.includes('unrecognized HMR message') ||
         message.includes('HMR message'))
      ) {
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      console.error = originalError
    }
  }, [])

  return null
}

