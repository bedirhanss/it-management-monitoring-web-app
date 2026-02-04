'use client'

import { useState, useCallback } from 'react'
import { Toast, ToastType } from '@/components/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration: duration || 5000,
      onConfirm,
      onCancel
    }

    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('success', title, message, duration)
  }, [addToast])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('error', title, message, duration)
  }, [addToast])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('warning', title, message, duration)
  }, [addToast])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addToast('info', title, message, duration)
  }, [addToast])

  const confirm = useCallback((title: string, message?: string, onConfirm?: () => void, onCancel?: () => void) => {
    return addToast('confirm', title, message, undefined, onConfirm, onCancel)
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    confirm
  }
}