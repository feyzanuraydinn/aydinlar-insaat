/**
 * API Client - CSRF korumalı API istekleri için
 */

let csrfToken: string | null = null

/**
 * CSRF token'ı al
 */
export async function fetchCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/admin/csrf', {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      csrfToken = data.token
      return csrfToken
    }

    return null
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error)
    return null
  }
}

/**
 * CSRF token'ı getir (cache'den veya yeni al)
 */
export async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) {
    return csrfToken
  }

  return fetchCSRFToken()
}

/**
 * CSRF token'ı sıfırla (logout sonrası)
 */
export function clearCSRFToken(): void {
  csrfToken = null
}

/**
 * API istek ayarları
 */
interface APIRequestOptions extends RequestInit {
  skipCSRF?: boolean
}

/**
 * CSRF korumalı API isteği yap
 */
export async function apiRequest<T>(
  url: string,
  options: APIRequestOptions = {}
): Promise<T> {
  const { skipCSRF = false, headers: customHeaders = {}, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  // CSRF token ekle (POST, PUT, PATCH, DELETE için)
  const method = (rest.method || 'GET').toUpperCase()
  const needsCSRF = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

  if (needsCSRF && !skipCSRF) {
    const token = await getCSRFToken()
    if (token) {
      headers['x-csrf-token'] = token
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers,
    credentials: 'include',
  })

  // CSRF token hatası - yeni token al ve tekrar dene
  if (response.status === 403) {
    const data = await response.json()
    if (data.error === 'Invalid CSRF token' || data.error === 'CSRF token missing') {
      // Yeni token al
      await fetchCSRFToken()

      // Tekrar dene
      const retryToken = await getCSRFToken()
      if (retryToken) {
        headers['x-csrf-token'] = retryToken
      }

      const retryResponse = await fetch(url, {
        ...rest,
        headers,
        credentials: 'include',
      })

      if (!retryResponse.ok) {
        const retryData = await retryResponse.json()
        throw new Error(retryData.error || 'API request failed')
      }

      return retryResponse.json()
    }

    throw new Error(data.error || 'Forbidden')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `API request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * GET isteği
 */
export function apiGet<T>(url: string, options?: APIRequestOptions): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'GET' })
}

/**
 * POST isteği
 */
export function apiPost<T>(
  url: string,
  data?: unknown,
  options?: APIRequestOptions
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT isteği
 */
export function apiPut<T>(
  url: string,
  data?: unknown,
  options?: APIRequestOptions
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH isteği
 */
export function apiPatch<T>(
  url: string,
  data?: unknown,
  options?: APIRequestOptions
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE isteği
 */
export function apiDelete<T>(url: string, options?: APIRequestOptions): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' })
}

/**
 * Form data ile upload (CSRF korumalı)
 */
export async function apiUpload<T>(
  url: string,
  formData: FormData,
  options?: Omit<APIRequestOptions, 'body'>
): Promise<T> {
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
    ...options,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Upload failed: ${response.status}`)
  }

  return response.json()
}
