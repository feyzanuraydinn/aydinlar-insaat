"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Card from "@/components/admin/Card"
import Button from "@/components/ui/Button"
import { useToast } from "@/components/admin/Toast"
import { PROPERTY_TYPE_MAIN_OPTIONS } from "@/data/property-labels"
import { useApi } from "@/hooks/useApi"
import Pagination from "@/components/ui/Pagination"
import { AdminListPageSkeleton } from "@/components/ui/Skeleton"
import SortDropdown from "@/components/ui/SortDropdown"

const ITEMS_PER_PAGE = 9

type SortOrder = 'newest' | 'oldest'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Yeniden Eskiye' },
  { value: 'oldest', label: 'Eskiden Yeniye' },
]

export default function PropertiesPage() {
  const toast = useToast()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const api = useApi()

  const fetchProperties = useCallback(async () => {
    try {
      const data = await api.get<{ properties: any[] }>("/api/admin/properties")
      if (data) {
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error("Gayrimenkuller yüklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchProperties()
  }, [])

  const { featuredCount, usedOrders } = useMemo(() => {
    const featured = properties.filter(p => p.featured)
    return {
      featuredCount: featured.length,
      usedOrders: featured.map(p => p.featuredOrder).filter(Boolean) as number[]
    }
  }, [properties])

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      if (a.featured && b.featured) {
        return (a.featuredOrder || 999) - (b.featuredOrder || 999)
      }
      if (a.featured) return -1
      if (b.featured) return 1
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })
  }, [properties, sortOrder])

  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const toggleFeatured = async (propertyId: string, currentFeatured: boolean, currentOrder: number | null) => {
    const newFeatured = !currentFeatured

    if (newFeatured && featuredCount >= 3) {
      toast.error('En fazla 3 gayrimenkul öne çıkarılabilir')
      return
    }

    let newOrder: number | null = null
    if (newFeatured) {
      for (let i = 1; i <= 3; i++) {
        if (!usedOrders.includes(i)) {
          newOrder = i
          break
        }
      }
    }

    setProperties(prev => prev.map(p =>
      p.id === propertyId
        ? { ...p, featured: newFeatured, featuredOrder: newOrder }
        : p
    ))

    try {
      const data = await api.patch<{ allProperties?: any[] }>(`/api/admin/properties/${propertyId}`, {
        featured: newFeatured,
      })

      if (data) {
        if (data.allProperties) {
          setProperties(data.allProperties)
        }
        toast.success(newFeatured ? 'Gayrimenkul öne çıkarıldı' : 'Öne çıkarma kaldırıldı')
      } else {
        fetchProperties()
        toast.error('Öne çıkarma durumu güncellenemedi')
      }
    } catch (error) {
      console.error("Öne çıkan durumu güncellenemedi:", error)
      fetchProperties()
      toast.error('Bir hata oluştu')
    }
  }

  const updateFeaturedOrder = async (propertyId: string, order: number) => {
    const currentProperty = properties.find(p => p.id === propertyId)
    const oldOrder = currentProperty?.featuredOrder

    setProperties(prev => {
      const targetProperty = prev.find(p => p.featured && p.featuredOrder === order && p.id !== propertyId)

      return prev.map(p => {
        if (p.id === propertyId) {
          return { ...p, featuredOrder: order }
        }
        if (targetProperty && p.id === targetProperty.id) {
          return { ...p, featuredOrder: oldOrder }
        }
        return p
      })
    })

    try {
      const data = await api.patch<{ allProperties?: any[] }>(`/api/admin/properties/${propertyId}`, {
        featuredOrder: order,
      })

      if (data) {
        if (data.allProperties) {
          setProperties(data.allProperties)
        }
        toast.success(`Sıra ${order} olarak güncellendi`)
      } else {
        fetchProperties()
        toast.error('Sıra güncellenemedi')
      }
    } catch (error) {
      console.error("Sıra güncellenemedi:", error)
      fetchProperties()
      toast.error('Bir hata oluştu')
    }
  }

  const togglePublished = async (propertyId: string, currentPublished: boolean) => {
    const newPublished = !currentPublished

    setProperties(prev => prev.map(p =>
      p.id === propertyId
        ? {
            ...p,
            publishedAt: newPublished ? new Date().toISOString() : null,
            ...(currentPublished && { featured: false, featuredOrder: null })
          }
        : p
    ))

    try {
      const data = await api.patch<{ allProperties?: any[] }>(`/api/admin/properties/${propertyId}`, {
        publishedAt: newPublished ? new Date().toISOString() : null,
        ...(currentPublished && { featured: false, featuredOrder: null })
      })

      if (data) {
        if (data.allProperties) {
          setProperties(data.allProperties)
        }
        toast.success(newPublished ? 'Yayınlandı' : 'Yayından kaldırıldı')
      } else {
        fetchProperties()
        toast.error('Yayınlama durumu güncellenemedi')
      }
    } catch (error) {
      console.error("Yayınlama durumu güncellenemedi:", error)
      fetchProperties()
      toast.error('Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <AdminListPageSkeleton
        title="Gayrimenkuller"
        subtitle="Aktif gayrimenkullerinizi buradan yönetin"
        cardCount={6}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">Gayrimenkuller</h1>
          <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Aktif gayrimenkullerinizi buradan yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <SortDropdown
            options={SORT_OPTIONS}
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value as SortOrder)
              setCurrentPage(1)
            }}
            variant="admin"
          />
          <Button variant="add" href="/admin/properties/new">
            Yeni Gayrimenkul Ekle
          </Button>
        </div>
      </div>

      {sortedProperties.length === 0 ? (
        <div className="bg-surface rounded-lg shadow p-6 sm:p-8 lg:p-12 text-center">
          <div className="text-text-muted mb-3 sm:mb-4">
            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-text-heading mb-2">Henüz gayrimenkul bulunmuyor</h3>
          <p className="text-text-tertiary mb-4 sm:mb-6 text-sm sm:text-base">İlk gayrimenkulünüzü ekleyerek başlayın</p>
          <Button variant="add" href="/admin/properties/new">
            Yeni Gayrimenkul Ekle
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedProperties.map((property: any) => (
              <Card
                key={property.id}
                item={property}
                type="property"
                typeLabel={PROPERTY_TYPE_MAIN_OPTIONS[property.type as keyof typeof PROPERTY_TYPE_MAIN_OPTIONS] || property.type}
                featuredCount={featuredCount}
                usedOrders={usedOrders}
                onToggleFeatured={toggleFeatured}
                onUpdateFeaturedOrder={updateFeaturedOrder}
                onTogglePublished={togglePublished}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={sortedProperties.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </>
      )}
    </div>
  )
}
