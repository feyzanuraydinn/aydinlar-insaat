"use client"

import { useState, useCallback } from "react"
import Sidebar from "@/components/admin/Sidebar"
import { ToastProvider } from "@/components/admin/Toast"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAuthPage = pathname === "/admin/login" ||
                     pathname === "/admin/forgot-password" ||
                     pathname === "/admin/reset-password"

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-surface">
        {!isAuthPage && (
          <>
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <div className="fixed top-0 left-0 z-50 flex items-center h-14 px-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/20 text-text-white cursor-pointer"
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`absolute h-0.5 w-6 bg-text-white transform transition-all duration-300 ease-in-out ${
                      sidebarOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 bg-text-white transition-all duration-300 ease-in-out ${
                      sidebarOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 bg-text-white transform transition-all duration-300 ease-in-out ${
                      sidebarOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                    }`}
                  />
                </div>
              </button>
            </div>
            <div className="fixed top-0 left-0 right-0 z-20 h-14 bg-hero lg:hidden flex items-center justify-center">
              <span className="text-text-white font-medium text-sm">
                Admin Panel
              </span>
            </div>
          </>
        )}

        <div className={`flex-1 ${isAuthPage ? '' : 'lg:ml-64 mt-14 lg:mt-0'}`}>
          {children}
        </div>
      </div>
    </ToastProvider>
  )
}
