"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/admin/Card"
import Button from "@/components/ui/Button"
import { useToast } from "@/components/admin/Toast"
import { PROJECT_TYPE_OPTIONS } from "@/data/property-labels"
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

export default function ProjectsPage() {
  const router = useRouter()
  const toast = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const api = useApi()

  const fetchProjects = useCallback(async () => {
    try {
      const data = await api.get<{ projects: any[] }>("/api/admin/projects")
      if (data) {
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Projeler yüklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchProjects()
  }, [])

  const { featuredCount, usedOrders } = useMemo(() => {
    const featured = projects.filter(p => p.featured)
    return {
      featuredCount: featured.length,
      usedOrders: featured.map(p => p.featuredOrder).filter(Boolean) as number[]
    }
  }, [projects])

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured && b.featured) {
        return (a.featuredOrder || 999) - (b.featuredOrder || 999)
      }
      if (a.featured) return -1
      if (b.featured) return 1
      const yearA = parseInt(a.year) || 0
      const yearB = parseInt(b.year) || 0
      if (sortOrder === 'newest') {
        return yearB - yearA
      } else {
        return yearA - yearB
      }
    })
  }, [projects, sortOrder])

  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleFeatured = async (projectId: string, currentFeatured: boolean, currentOrder: number | null) => {
    const newFeatured = !currentFeatured

    if (newFeatured && featuredCount >= 3) {
      toast.error('En fazla 3 proje öne çıkarılabilir')
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

    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, featured: newFeatured, featuredOrder: newOrder }
        : p
    ))

    try {
      const data = await api.patch<{ allProjects?: any[] }>(`/api/admin/projects/${projectId}`, {
        featured: newFeatured,
      })

      if (data) {
        if (data.allProjects) {
          setProjects(data.allProjects)
        }
        toast.success(newFeatured ? 'Proje öne çıkarıldı' : 'Öne çıkarma kaldırıldı')
      } else {
        fetchProjects()
        toast.error('Öne çıkarma durumu güncellenemedi')
      }
    } catch (error) {
      console.error("Öne çıkan durumu güncellenemedi:", error)
      fetchProjects()
      toast.error('Bir hata oluştu')
    }
  }

  const updateFeaturedOrder = async (projectId: string, order: number) => {
    const currentProject = projects.find(p => p.id === projectId)
    const oldOrder = currentProject?.featuredOrder

    setProjects(prev => {
      const targetProject = prev.find(p => p.featured && p.featuredOrder === order && p.id !== projectId)

      return prev.map(p => {
        if (p.id === projectId) {
          return { ...p, featuredOrder: order }
        }
        if (targetProject && p.id === targetProject.id) {
          return { ...p, featuredOrder: oldOrder }
        }
        return p
      })
    })

    try {
      const data = await api.patch<{ allProjects?: any[] }>(`/api/admin/projects/${projectId}`, {
        featuredOrder: order,
      })

      if (data) {
        if (data.allProjects) {
          setProjects(data.allProjects)
        }
        toast.success(`Sıra ${order} olarak güncellendi`)
      } else {
        fetchProjects()
        toast.error('Sıra güncellenemedi')
      }
    } catch (error) {
      console.error("Sıra güncellenemedi:", error)
      fetchProjects()
      toast.error('Bir hata oluştu')
    }
  }

  const togglePublished = async (projectId: string, currentPublished: boolean) => {
    const newPublished = !currentPublished

    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? {
            ...p,
            publishedAt: newPublished ? new Date().toISOString() : null,
            ...(currentPublished && { featured: false, featuredOrder: null })
          }
        : p
    ))

    try {
      const data = await api.patch<{ allProjects?: any[] }>(`/api/admin/projects/${projectId}`, {
        publishedAt: newPublished ? new Date().toISOString() : null,
        ...(currentPublished && { featured: false, featuredOrder: null })
      })

      if (data) {
        if (data.allProjects) {
          setProjects(data.allProjects)
        }
        toast.success(newPublished ? 'Yayınlandı' : 'Yayından kaldırıldı')
      } else {
        fetchProjects()
        toast.error('Yayınlama durumu güncellenemedi')
      }
    } catch (error) {
      console.error("Yayınlama durumu güncellenemedi:", error)
      fetchProjects()
      toast.error('Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <AdminListPageSkeleton
        title="Projeler"
        subtitle="Tamamlanmış projelerinizi buradan yönetin"
        cardCount={6}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">Projeler</h1>
          <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Tamamlanmış projelerinizi buradan yönetin</p>
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
          <Button variant="add" href="/admin/projects/new">
            Yeni Proje Ekle
          </Button>
        </div>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="bg-surface rounded-lg shadow p-6 sm:p-8 lg:p-12 text-center">
          <div className="text-text-muted mb-3 sm:mb-4">
            <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-text-heading mb-2">Henüz proje bulunmuyor</h3>
          <p className="text-text-tertiary mb-4 sm:mb-6 text-sm sm:text-base">İlk projenizi ekleyerek başlayın</p>
          <Button variant="add" href="/admin/projects/new">
            Yeni Proje Ekle
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedProjects.map((project: any) => (
              <Card
                key={project.id}
                item={project}
                type="project"
                typeLabel={PROJECT_TYPE_OPTIONS[project.type as keyof typeof PROJECT_TYPE_OPTIONS] || project.type}
                featuredCount={featuredCount}
                usedOrders={usedOrders}
                onToggleFeatured={toggleFeatured}
                onUpdateFeaturedOrder={updateFeaturedOrder}
                onTogglePublished={togglePublished}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedProjects.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}
    </div>
  )
}
