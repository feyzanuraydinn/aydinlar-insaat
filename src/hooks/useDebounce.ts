"use client"

import { useState, useEffect } from 'react'

/**
 * useDebounce - Bir değerin belirli bir süre sonra güncellenmesini sağlar
 * Arama inputları, otomatik kaydetme gibi işlemler için kullanışlıdır
 *
 * @param value - Debounce edilecek değer
 * @param delay - Gecikme süresi (ms)
 * @returns Debounce edilmiş değer
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // API çağrısı yapılır
 *   searchProjects(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
