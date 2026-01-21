'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * CSRF token yönetimi için hook
 */
export function useCSRF() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // CSRF token'ı al
  const fetchToken = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/csrf', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setCsrfToken(data.token)
        return data.token
      } else {
        throw new Error('Failed to fetch CSRF token')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Token'ı yenile
  const refreshToken = useCallback(async () => {
    return fetchToken()
  }, [fetchToken])

  // Component mount'ta token al
  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  return {
    csrfToken,
    loading,
    error,
    refreshToken,
  }
}

export default useCSRF
