"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"

// Toast Types
interface ToastData {
  id: string
  type: "success" | "error" | "warning"
  message: string
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

// Toast Item Component
function ToastItem({
  type,
  message,
  onClose
}: {
  type: ToastData["type"]
  message: string
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: {
      iconBg: "bg-success/20",
      iconColor: "text-success",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
        </svg>
      )
    },
    error: {
      iconBg: "bg-danger/20",
      iconColor: "text-danger",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>
      )
    },
    warning: {
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-500",
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      )
    }
  }

  const { iconBg, iconColor, icon } = config[type]

  return (
    <div
      className="flex items-center w-full max-w-sm p-4 border border-border rounded-lg shadow-lg bg-surface"
      role="alert"
    >
      <div className={`inline-flex items-center justify-center shrink-0 w-7 h-7 rounded ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="font-normal text-md text-hero ms-3">{message}</div>
    </div>
  )
}

// Toast Provider Component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((type: ToastData["type"], message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message: string) => addToast("success", message), [addToast])
  const error = useCallback((message: string) => addToast("error", message), [addToast])
  const warning = useCallback((message: string) => addToast("warning", message), [addToast])

  return (
    <ToastContext.Provider value={{ success, error, warning }}>
      {children}
      <div className="fixed z-50 space-y-3 bottom-4 right-4">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// useToast Hook
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
