"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Input from "@/components/admin/Input"
import { useToast } from "@/components/admin/Toast"

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Geçersiz e-posta veya şifre")
      } else {
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")
        router.push("/admin")
        router.refresh()
      }
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Login Form */}
        <div className="rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 bg-hero">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center">
              <svg className="h-12 w-12 sm:h-16 sm:w-16 text-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-text-white">
              Aydınlar İnşaat
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-text-white-secondary">
              Yönetim Paneli Girişi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="E-posta Adresi"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@aydinlarinsaat.com"
              required
              variant="dark"
            />

            <div>
              <Input
                label="Şifre"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required
                variant="dark"
              />
              <div className="mt-1.5 sm:mt-2 text-right">
                <Link
                  href="/admin/forgot-password"
                  className="text-xs sm:text-sm text-primary-light hover:text-primary-bg-hover"
                >
                  Şifremi Unuttum
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="login"
              disabled={loading}
              loading={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-text-tertiary">
          © 2024 Aydınlar İnşaat. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}
