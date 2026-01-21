"use client"

import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage - localStorage ile senkronize çalışan state hook'u
 * Tema tercihi, sidebar durumu, kullanıcı ayarları gibi veriler için kullanışlıdır
 *
 * @param key - localStorage'da kullanılacak key
 * @param initialValue - Varsayılan değer
 * @returns [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light')
 * const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebarOpen', true)
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Başlangıç değerini localStorage'dan oku
  const readValue = useCallback((): T => {
    // SSR kontrolü
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // localStorage'a yaz
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      // SSR kontrolü
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        )
        return
      }

      try {
        // Fonksiyon olarak verilmişse hesapla
        const newValue = value instanceof Function ? value(storedValue) : value

        // localStorage'a kaydet
        window.localStorage.setItem(key, JSON.stringify(newValue))

        // State'i güncelle
        setStoredValue(newValue)

        // Diğer sekmelere bildir
        window.dispatchEvent(new StorageEvent('storage', { key }))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // localStorage'dan sil
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Diğer sekmelerdeki değişiklikleri dinle
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        setStoredValue(JSON.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  // İlk mount'ta localStorage'dan oku
  useEffect(() => {
    setStoredValue(readValue())
  }, [readValue])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
