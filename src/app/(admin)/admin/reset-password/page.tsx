"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Button from "@/components/ui/Button"
import Input from "@/components/admin/Input"
import { useToast } from "@/components/admin/Toast"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState<boolean | null>(null)

  useEffect(() => {
    // Token geçerliliğini kontrol et
    const verifyToken = async () => {
      if (!token) {
        setValidToken(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/reset-password?token=${token}`)
        setValidToken(response.ok)
      } catch {
        setValidToken(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor")
      return
    }

    if (password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Bir hata oluştu")
      } else {
        setSuccess(true)
        toast.success("Şifreniz başarıyla güncellendi!")
        setTimeout(() => {
          router.push("/admin/login")
        }, 3000)
      }
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  // Token kontrolü yapılıyor
  if (validToken === null) {
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-white-secondary">Doğrulanıyor...</p>
      </div>
    )
  }

  // Geçersiz veya süresi dolmuş token
  if (!validToken) {
    return (
      <div className="text-center">
        <div className="mb-4 sm:mb-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-danger rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-text-white mb-2">
          Geçersiz veya Süresi Dolmuş Bağlantı
        </h3>
        <p className="text-xs sm:text-sm text-text-white-secondary mb-4 sm:mb-6">
          Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
          Lütfen yeni bir şifre sıfırlama talebinde bulunun.
        </p>
        <div className="flex justify-center">
          <Button variant="back" href="/admin/forgot-password">
            Yeni şifre sıfırlama talebi
          </Button>
        </div>
      </div>
    )
  }

  // Başarılı şifre sıfırlama
  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 sm:mb-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-success rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-text-white mb-2">
          Şifreniz Güncellendi
        </h3>
        <p className="text-xs sm:text-sm text-text-white-secondary mb-4 sm:mb-6">
          Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <Input
        label="Yeni Şifre"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        required
        variant="dark"
      />

      <Input
        label="Yeni Şifre (Tekrar)"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="••••••••"
        required
        variant="dark"
      />

      <div className="space-y-3 sm:space-y-4">
        <Button
          type="submit"
          variant="login"
          disabled={loading}
          loading={loading}
        >
          {loading ? "Güncelleniyor..." : "Şifremi Güncelle"}
        </Button>

        <div className="flex justify-center pt-1 sm:pt-2">
          <Button variant="back" href="/admin/login">
            Giriş sayfasına dön
          </Button>
        </div>
      </div>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Form Card */}
        <div className="rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 bg-hero">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center">
              <svg className="h-12 w-12 sm:h-16 sm:w-16 text-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-text-white">
              Yeni Şifre Belirle
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-text-white-secondary">
              Hesabınız için yeni bir şifre belirleyin
            </p>
          </div>

          <Suspense fallback={
            <div className="text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <p className="text-xs sm:text-sm text-text-white-secondary">Yükleniyor...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-text-tertiary">
          © 2024 Aydınlar İnşaat. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}
