'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// CSRF token cache
let cachedCSRFToken: string | null = null

/**
 * CSRF token'ı al veya cache'den döndür
 */
async function getCSRFToken(): Promise<string | null> {
  if (cachedCSRFToken) {
    return cachedCSRFToken
  }

  try {
    const response = await fetch('/api/admin/csrf', {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      cachedCSRFToken = data.token
      return cachedCSRFToken
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error)
  }

  return null
}

/**
 * CSRF token'ı sıfırla
 */
export function clearCSRFToken(): void {
  cachedCSRFToken = null
}

/**
 * CSRF token'ı yenile
 */
export async function refreshCSRFToken(): Promise<string | null> {
  cachedCSRFToken = null
  return getCSRFToken()
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * API istekleri için hook
 * Otomatik CSRF token yönetimi
 */
export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const optionsRef = useRef(options)
  optionsRef.current = options

  // İlk mount'ta CSRF token al
  useEffect(() => {
    getCSRFToken()
  }, [])

  /**
   * API isteği yap
   */
  const request = useCallback(async (
    url: string,
    requestOptions: RequestInit = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const method = (requestOptions.method || 'GET').toUpperCase()
      const needsCSRF = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(requestOptions.headers as Record<string, string> || {}),
      }

      // CSRF token ekle
      if (needsCSRF) {
        const token = await getCSRFToken()
        if (token) {
          headers['x-csrf-token'] = token
        }
      }

      const response = await fetch(url, {
        ...requestOptions,
        headers,
        credentials: 'include',
      })

      // CSRF token hatası - yenile ve tekrar dene
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}))

        if (errorData.error?.includes('CSRF')) {
          const newToken = await refreshCSRFToken()
          if (newToken) {
            headers['x-csrf-token'] = newToken

            const retryResponse = await fetch(url, {
              ...requestOptions,
              headers,
              credentials: 'include',
            })

            if (retryResponse.ok) {
              const data = await retryResponse.json() as T
              setState({ data, loading: false, error: null })
              optionsRef.current.onSuccess?.(data)
              return data
            }
          }
        }

        throw new Error(errorData.error || 'Forbidden')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed: ${response.status}`)
      }

      const data = await response.json() as T
      setState({ data, loading: false, error: null })
      optionsRef.current.onSuccess?.(data)
      return data

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
      optionsRef.current.onError?.(err)
      return null
    }
  }, [])

  /**
   * GET isteği
   */
  const get = useCallback(<R = unknown>(url: string): Promise<R | null> => {
    return request(url, { method: 'GET' }) as Promise<R | null>
  }, [request])

  /**
   * POST isteği
   */
  const post = useCallback(<R = unknown>(url: string, data?: unknown): Promise<R | null> => {
    return request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<R | null>
  }, [request])

  /**
   * PUT isteği
   */
  const put = useCallback(<R = unknown>(url: string, data?: unknown): Promise<R | null> => {
    return request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<R | null>
  }, [request])

  /**
   * PATCH isteği
   */
  const patch = useCallback(<R = unknown>(url: string, data?: unknown): Promise<R | null> => {
    return request(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<R | null>
  }, [request])

  /**
   * DELETE isteği
   */
  const del = useCallback(<R = unknown>(url: string): Promise<R | null> => {
    return request(url, { method: 'DELETE' }) as Promise<R | null>
  }, [request])

  /**
   * FormData ile upload
   */
  const upload = useCallback(async <R = unknown>(url: string, formData: FormData): Promise<R | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const token = await getCSRFToken()
      const headers: Record<string, string> = {}

      if (token) {
        headers['x-csrf-token'] = token
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed: ${response.status}`)
      }

      const data = await response.json() as R
      setState({ data: data as unknown as T, loading: false, error: null })
      optionsRef.current.onSuccess?.(data)
      return data

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState({ data: null, loading: false, error: err })
      optionsRef.current.onError?.(err)
      return null
    }
  }, [])

  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    del,
    upload,
  }
}

export default useApi
