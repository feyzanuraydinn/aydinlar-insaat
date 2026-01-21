"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Button from "@/components/ui/Button"
import ConfirmModal from "@/components/admin/ConfirmModal"
import { useToast } from "@/components/admin/Toast"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const toast = useToast()

  const [projectsOpen, setProjectsOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (pathname.startsWith('/admin/projects')) {
      setProjectsOpen(true)
      setPropertiesOpen(false)
    } else if (pathname.startsWith('/admin/properties')) {
      setPropertiesOpen(true)
      setProjectsOpen(false)
    } else {
      setProjectsOpen(false)
      setPropertiesOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  const confirmLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      window.location.href = "/admin/login"
    } catch {
      toast.error("Çıkış yapılırken bir hata oluştu")
      setLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  const toggleProjects = () => {
    const newValue = !projectsOpen
    setProjectsOpen(newValue)
    if (newValue) {
      setPropertiesOpen(false)
    }
  }

  const toggleProperties = () => {
    const newValue = !propertiesOpen
    setPropertiesOpen(newValue)
    if (newValue) {
      setProjectsOpen(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 bg-hero ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center mb-5 pl-10 lg:pl-0">
            <Link href="/admin" className="flex items-center ps-2.5">
              <img
                src="/logo.svg"
                alt="Aydınlar İnşaat"
                className="h-8 sm:h-10 w-auto brightness-0 invert"
              />
            </Link>
          </div>

          <div className="mb-5 border-t border-text-white/20"></div>

          <ul className="space-y-2 font-medium text-sm">
            <li>
              <Link
                href="/admin"
                className={`flex items-center px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white ${
                  pathname === "/admin" ? "bg-white/20" : ""
                }`}
              >
                <svg className="w-5 h-5 transition duration-75 text-text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/>
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={toggleProjects}
                className={`flex items-center w-full justify-between px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white ${
                  pathname.startsWith("/admin/projects") ? "bg-white/20" : ""
                }`}
                aria-controls="dropdown-projects"
              >
                <div className="flex items-center">
                  <svg className="shrink-0 w-5 h-5 transition duration-75 text-text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Projeler</span>
                </div>
                <svg className={`w-5 h-5 text-text-white transition-transform ${projectsOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                </svg>
              </button>
              <ul id="dropdown-projects" className={`${projectsOpen ? "" : "hidden"} py-2 space-y-1`}>
                <li>
                  <Link href="/admin/projects" className="pl-10 flex items-center px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white text-sm">
                    Tüm Projeleri Görüntüle
                  </Link>
                </li>
                <li>
                  <Link href="/admin/projects/new" className="pl-10 flex items-center px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white text-sm">
                    + Yeni Proje Ekle
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                type="button"
                onClick={toggleProperties}
                className={`flex items-center w-full justify-between px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white ${
                  pathname.startsWith("/admin/properties") ? "bg-white/20" : ""
                }`}
                aria-controls="dropdown-properties"
              >
                <div className="flex items-center">
                  <svg className="shrink-0 w-5 h-5 transition duration-75 text-text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Gayrimenkuller</span>
                </div>
                <svg className={`w-5 h-5 text-text-white transition-transform ${propertiesOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                </svg>
              </button>
              <ul id="dropdown-properties" className={`${propertiesOpen ? "" : "hidden"} py-2 space-y-1`}>
                <li>
                  <Link href="/admin/properties" className="pl-10 flex items-center px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white text-sm">
                    Tüm Gayrimenkulleri Gör
                  </Link>
                </li>
                <li>
                  <Link href="/admin/properties/new" className="pl-10 flex items-center px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white text-sm">
                    + Yeni Gayrimenkul Ekle
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href="/admin/settings"
                className={`flex items-center px-2 py-2 sm:py-1.5 rounded-lg hover:bg-white/20 group cursor-pointer text-text-white ${
                  pathname.startsWith("/admin/settings") ? "bg-white/20" : ""
                }`}
              >
                <svg className="w-5 h-5 transition duration-75 text-text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="ms-3">Ayarlar</span>
              </Link>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-text-white/20">
            <Button
              variant="logout"
              onClick={() => setShowLogoutDialog(true)}
              className="w-full"
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutDialog}
        title="Çıkış Yap"
        message="Çıkış yapmak istediğinizden emin misiniz?"
        confirmText="Çıkış Yap"
        cancelText="İptal"
        confirmVariant="logout"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
        isLoading={loggingOut}
      />
    </>
  )
}
