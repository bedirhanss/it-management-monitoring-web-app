'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, BellIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'notification'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onConfirm?: () => void
  onCancel?: () => void
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    if (toast.type !== 'confirm') {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
      case 'confirm':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
      case 'notification':
        return <BellIcon className="h-5 w-5 text-white dark:text-gray-900" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500'
      case 'error':
        return 'border-l-red-500'
      case 'warning':
      case 'confirm':
        return 'border-l-yellow-500'
      case 'info':
        return 'border-l-blue-500'
      case 'notification':
        return 'border-l-gray-900 dark:border-l-gray-100'
    }
  }

  const handleConfirm = () => {
    if (toast.onConfirm) {
      toast.onConfirm()
    }
    handleRemove()
  }

  const handleCancel = () => {
    if (toast.onCancel) {
      toast.onCancel()
    }
    handleRemove()
  }

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isRemoving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${
        toast.type === 'notification' 
          ? 'bg-gray-900 dark:bg-gray-100' 
          : 'bg-white dark:bg-gray-800'
      } shadow-lg rounded-lg border-l-4 ${getBorderColor()} p-4 mb-3 w-80`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              toast.type === 'notification'
                ? 'text-white dark:text-gray-900'
                : 'text-gray-900 dark:text-white'
            }`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`mt-1 text-sm ${
                toast.type === 'notification'
                  ? 'text-gray-300 dark:text-gray-700'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {toast.message}
              </p>
            )}
            {toast.type === 'confirm' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                >
                  Evet
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-3 py-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white text-sm font-medium rounded transition-colors"
                >
                  Hayır
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={toast.type === 'confirm' ? handleCancel : handleRemove}
              className={`inline-flex transition-colors ${
                toast.type === 'notification'
                  ? 'text-gray-400 hover:text-gray-200 dark:text-gray-600 dark:hover:text-gray-800'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}