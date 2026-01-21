"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import Button from "@/components/ui/Button"
import FileUpload from "@/components/admin/FileUpload"
import Input from "@/components/admin/Input"
import Select from "@/components/admin/Select"
import Textarea from "@/components/admin/Textarea"
import { useToast } from "@/components/admin/Toast"
import ConfirmModal from "@/components/admin/ConfirmModal"
import { useApi } from "@/hooks/useApi"
import { FormSkeleton } from "@/components/ui/Skeleton"

// Leaflet'i sadece istemci tarafında yükle
const LocationPicker = dynamic(() => import("@/components/admin/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Harita yükleniyor...</div>
    </div>
  )
})
import {
  RESIDENTIAL_LABELS,
  COMMERCIAL_LABELS,
  PROJECT_TYPE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  ROOM_COUNT_OPTIONS,
  HOUSING_TYPE_OPTIONS,
  BUILDING_AGE_OPTIONS,
  CURRENT_FLOOR_OPTIONS,
  TOTAL_FLOORS_OPTIONS,
  HEATING_OPTIONS,
  BATHROOM_COUNT_OPTIONS,
  KITCHEN_OPTIONS,
  BALCONY_OPTIONS,
  ELEVATOR_OPTIONS,
  PARKING_OPTIONS,
  FURNISHED_OPTIONS,
  USAGE_STATUS_OPTIONS,
  IN_COMPLEX_OPTIONS,
  MORTGAGE_ELIGIBLE_OPTIONS,
  COMMERCIAL_TYPE_OPTIONS,
  DEED_STATUS_OPTIONS,
  LISTED_BY_OPTIONS,
  EXCHANGE_OPTIONS,
} from "@/data/property-labels"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const toast = useToast()
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingImage, setDeletingImage] = useState(false)
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null)
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    year: new Date().getFullYear().toString(),
    type: "",
    slug: "",
    featured: false,
    featuredOrder: null as number | null,
  })

  const [residentialData, setResidentialData] = useState<any>({})
  const [commercialData, setCommercialData] = useState<any>({})
  const [images, setImages] = useState<{id?: string, file?: File, preview: string, isCover: boolean, url?: string, publicId?: string, order?: number}[]>([])

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const data = await api.get<{ project: any }>(`/api/admin/projects/${id}`)
      if (!data) throw new Error("Proje yüklenemedi")

      const { project } = data

      setFormData({
        title: project.title,
        description: project.description,
        location: project.location,
        latitude: project.latitude || null,
        longitude: project.longitude || null,
        year: project.year,
        type: project.type,
        slug: project.slug,
        featured: project.featured || false,
        featuredOrder: project.featuredOrder || null,
      })

      if (project.type === "RESIDENTIAL" && project.residentialDetails) {
        setResidentialData(project.residentialDetails)
      } else if (project.type === "COMMERCIAL" && project.commercialDetails) {
        setCommercialData(project.commercialDetails)
      }

      // Mevcut görselleri yükle
      if (project.images) {
        setImages(project.images.map((img: any) => ({
          id: img.id,
          preview: img.url,
          url: img.url,
          publicId: img.publicId,
          isCover: img.isCover,
          order: img.order
        })))
      }

    } catch (err: any) {
      setError(err.message || "Proje yüklenirken hata oluştu")
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleResidentialChange = (field: string, value: any) => {
    setResidentialData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleCommercialChange = (field: string, value: any) => {
    setCommercialData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)

    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          file,
          preview: reader.result as string,
          isCover: prev.length === 0
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const confirmDeleteImage = async () => {
    if (deleteImageIndex === null || deletingImage) return

    // Store the index locally to avoid state changes during async operation
    const indexToDelete = deleteImageIndex
    const imageToRemove = images[indexToDelete]

    if (!imageToRemove) {
      setDeleteImageIndex(null)
      return
    }

    setDeletingImage(true)

    // Delete from Cloudinary if it has a publicId
    if (imageToRemove.publicId) {
      try {
        const result = await api.request("/api/admin/upload", {
          method: "DELETE",
          body: JSON.stringify({ publicId: imageToRemove.publicId }),
        })

        if (!result) {
          toast.error("Cloud'dan görsel silinemedi")
          setDeleteImageIndex(null)
          setDeletingImage(false)
          return
        }
      } catch (error) {
        toast.error("Cloud silme hatası")
        setDeleteImageIndex(null)
        setDeletingImage(false)
        return
      }
    }

    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== indexToDelete)
      // If deleted image was cover and there are remaining images, set first as cover
      if (prev[indexToDelete]?.isCover && newImages.length > 0) {
        newImages[0].isCover = true
      }
      return newImages
    })
    toast.success("Görsel başarıyla silindi")
    setDeleteImageIndex(null)
    setDeletingImage(false)
  }

  const setCoverImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isCover: i === index
    })))
  }

  const uploadNewImages = async (): Promise<any[]> => {
    const newImages = images.filter(img => img.file)
    if (newImages.length === 0) return []

    const uploadedImages: any[] = []

    for (let i = 0; i < newImages.length; i++) {
      const uploadFormData = new FormData()
      uploadFormData.append("file", newImages[i].file!)

      const data = await api.upload<{ url: string; publicId: string }>("/api/admin/upload", uploadFormData)

      if (!data) throw new Error(api.error?.message || "Görsel yüklenemedi")

      uploadedImages.push({
        url: data.url,
        publicId: data.publicId,
        alt: formData.title || `Proje görseli`,
        order: images.indexOf(newImages[i]),
        isCover: newImages[i].isCover
      })
    }

    return uploadedImages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      setUploadingImages(true)
      const uploadedImages = await uploadNewImages()
      setUploadingImages(false)

      // Mevcut ve yeni görselleri birleştir
      // id ve projectId alanlarını çıkarıyoruz çünkü bunlar create işleminde kullanılmamalı
      const allImages = [
        ...images.filter(img => !img.file).map((img, idx) => ({
          url: img.url!,
          publicId: img.publicId,
          alt: formData.title,
          order: idx,
          isCover: img.isCover
        })),
        ...uploadedImages
      ]

      const projectData: any = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        year: formData.year,
        type: formData.type,
        slug: formData.slug,
        featured: formData.featured,
        featuredOrder: formData.featuredOrder,
        metaTitle: formData.title,
        metaDescription: formData.description.substring(0, 160),
      }

      // Tip-spesifik detaylardan id ve projectId alanlarını çıkar
      const cleanResidentialData = residentialData ? Object.fromEntries(
        Object.entries(residentialData).filter(([key]) => key !== 'id' && key !== 'projectId')
      ) : undefined

      const cleanCommercialData = commercialData ? Object.fromEntries(
        Object.entries(commercialData).filter(([key]) => key !== 'id' && key !== 'projectId')
      ) : undefined

      const result = await api.put<{ project: any }>(`/api/admin/projects/${id}`, {
        ...projectData,
        images: allImages,
        residentialDetails: formData.type === "RESIDENTIAL" ? cleanResidentialData : undefined,
        commercialDetails: formData.type === "COMMERCIAL" ? cleanCommercialData : undefined,
      })

      if (!result) {
        throw new Error(api.error?.message || "Proje güncellenemedi")
      }

      toast.success("Proje başarıyla güncellendi")
      router.push("/admin/projects")
      router.refresh()
    } catch (err: any) {
      const errorMessage = err.message || "Bir hata oluştu"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      setUploadingImages(false)
    }
  }

  const confirmDeleteProject = async () => {
    setDeleting(true)
    try {
      const result = await api.del(`/api/admin/projects/${id}`)

      if (!result) throw new Error("Proje silinemedi")

      toast.success("Proje başarıyla silindi")
      router.push("/admin/projects")
      router.refresh()
    } catch (err: any) {
      const errorMessage = err.message || "Silme işlemi başarısız"
      setError(errorMessage)
      toast.error(errorMessage)
      setDeleting(false)
      setShowDeleteProjectDialog(false)
    }
  }

  if (fetching) {
    return <FormSkeleton />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">Projeyi Düzenle</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Proje bilgilerini güncelleyin</p>
      </div>

      <div className="bg-surface rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Temel Bilgiler */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading border-b border-border pb-2">Temel Bilgiler</h2>

              <Input
                label="Proje Başlığı"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                required
              />

              <Textarea
                label="Açıklama"
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                required
                rows={4}
              />

              <Input
                label="Yıl"
                type="number"
                value={formData.year}
                onChange={(value) => handleChange('year', value)}
                required
              />

              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-heading mb-2 sm:mb-2.5">
                  Harita Konumu
                </label>
                {!fetching && (
                  <LocationPicker
                    key={`${formData.latitude}-${formData.longitude}`}
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationChange={(lat, lng, address) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                        location: address || prev.location
                      }))
                    }}
                  />
                )}
                {fetching && (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">Harita yükleniyor...</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proje Tipi *</label>
                <div className="text-sm text-gray-500">
                  {PROJECT_TYPE_OPTIONS[formData.type as keyof typeof PROJECT_TYPE_OPTIONS]}
                </div>
              </div>
            </div>

            {/* Konut Detayları */}
            {formData.type === "RESIDENTIAL" && (
              <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading border-b border-border pb-2">Konut Projesi Detayları</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Input
                    label={RESIDENTIAL_LABELS.price}
                    type="number"
                    value={residentialData.price || ""}
                    onChange={(value) => handleResidentialChange('price', value ? parseFloat(value) : null)}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.propertyType}
                    value={residentialData.propertyType || ""}
                    onChange={(value) => handleResidentialChange('propertyType', value)}
                    options={Object.entries(PROPERTY_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Input
                    label={RESIDENTIAL_LABELS.grossArea}
                    type="number"
                    value={residentialData.grossArea || ""}
                    onChange={(value) => handleResidentialChange('grossArea', value ? parseFloat(value) : null)}
                  />
                  <Input
                    label={RESIDENTIAL_LABELS.netArea}
                    type="number"
                    value={residentialData.netArea || ""}
                    onChange={(value) => handleResidentialChange('netArea', value ? parseFloat(value) : null)}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.roomCount}
                    value={residentialData.roomCount || ""}
                    onChange={(value) => handleResidentialChange('roomCount', value)}
                    options={Object.entries(ROOM_COUNT_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.housingType}
                    value={residentialData.housingType || ""}
                    onChange={(value) => handleResidentialChange('housingType', value)}
                    options={Object.entries(HOUSING_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.buildingAge}
                    value={residentialData.buildingAge || ""}
                    onChange={(value) => handleResidentialChange('buildingAge', value)}
                    options={Object.entries(BUILDING_AGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.heating}
                    value={residentialData.heating || ""}
                    onChange={(value) => handleResidentialChange('heating', value)}
                    options={Object.entries(HEATING_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.bathroomCount}
                    value={residentialData.bathroomCount || ""}
                    onChange={(value) => handleResidentialChange('bathroomCount', value)}
                    options={Object.entries(BATHROOM_COUNT_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.balcony}
                    value={residentialData.balcony || ""}
                    onChange={(value) => handleResidentialChange('balcony', value)}
                    options={Object.entries(BALCONY_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.elevator}
                    value={residentialData.elevator || ""}
                    onChange={(value) => handleResidentialChange('elevator', value)}
                    options={Object.entries(ELEVATOR_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.parking}
                    value={residentialData.parking || ""}
                    onChange={(value) => handleResidentialChange('parking', value)}
                    options={Object.entries(PARKING_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.currentFloor}
                    value={residentialData.currentFloor || ""}
                    onChange={(value) => handleResidentialChange('currentFloor', value)}
                    options={Object.entries(CURRENT_FLOOR_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.totalFloors}
                    value={residentialData.totalFloors || ""}
                    onChange={(value) => handleResidentialChange('totalFloors', value)}
                    options={Object.entries(TOTAL_FLOORS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.kitchen}
                    value={residentialData.kitchen || ""}
                    onChange={(value) => handleResidentialChange('kitchen', value)}
                    options={Object.entries(KITCHEN_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.furnished}
                    value={residentialData.furnished || ""}
                    onChange={(value) => handleResidentialChange('furnished', value)}
                    options={Object.entries(FURNISHED_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.usageStatus}
                    value={residentialData.usageStatus || ""}
                    onChange={(value) => handleResidentialChange('usageStatus', value)}
                    options={Object.entries(USAGE_STATUS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.inComplex}
                    value={residentialData.inComplex || ""}
                    onChange={(value) => handleResidentialChange('inComplex', value)}
                    options={Object.entries(IN_COMPLEX_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.mortgageEligible}
                    value={residentialData.mortgageEligible || ""}
                    onChange={(value) => handleResidentialChange('mortgageEligible', value)}
                    options={Object.entries(MORTGAGE_ELIGIBLE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.deedStatus}
                    value={residentialData.deedStatus || ""}
                    onChange={(value) => handleResidentialChange('deedStatus', value)}
                    options={Object.entries(DEED_STATUS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.listedBy}
                    value={residentialData.listedBy || ""}
                    onChange={(value) => handleResidentialChange('listedBy', value)}
                    options={Object.entries(LISTED_BY_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={RESIDENTIAL_LABELS.exchange}
                    value={residentialData.exchange || ""}
                    onChange={(value) => handleResidentialChange('exchange', value)}
                    options={Object.entries(EXCHANGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                </div>
              </div>
            )}

            {/* Ticari Detayları */}
            {formData.type === "COMMERCIAL" && (
              <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading border-b border-border pb-2">Ticari Proje Detayları</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Input
                    label={COMMERCIAL_LABELS.price}
                    type="number"
                    value={commercialData.price || ""}
                    onChange={(value) => handleCommercialChange('price', value ? parseFloat(value) : null)}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.propertyType}
                    value={commercialData.propertyType || ""}
                    onChange={(value) => handleCommercialChange('propertyType', value)}
                    options={Object.entries(PROPERTY_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.commercialType}
                    value={commercialData.commercialType || ""}
                    onChange={(value) => handleCommercialChange('commercialType', value)}
                    options={Object.entries(COMMERCIAL_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Input
                    label={COMMERCIAL_LABELS.area}
                    type="number"
                    value={commercialData.area || ""}
                    onChange={(value) => handleCommercialChange('area', value ? parseFloat(value) : null)}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.roomCount}
                    value={commercialData.roomCount || ""}
                    onChange={(value) => handleCommercialChange('roomCount', value)}
                    options={Object.entries(ROOM_COUNT_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.heating}
                    value={commercialData.heating || ""}
                    onChange={(value) => handleCommercialChange('heating', value)}
                    options={Object.entries(HEATING_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.buildingAge}
                    value={commercialData.buildingAge || ""}
                    onChange={(value) => handleCommercialChange('buildingAge', value)}
                    options={Object.entries(BUILDING_AGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.deedStatus}
                    value={commercialData.deedStatus || ""}
                    onChange={(value) => handleCommercialChange('deedStatus', value)}
                    options={Object.entries(DEED_STATUS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.listedBy}
                    value={commercialData.listedBy || ""}
                    onChange={(value) => handleCommercialChange('listedBy', value)}
                    options={Object.entries(LISTED_BY_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                  <Select
                    label={COMMERCIAL_LABELS.exchange}
                    value={commercialData.exchange || ""}
                    onChange={(value) => handleCommercialChange('exchange', value)}
                    options={Object.entries(EXCHANGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                </div>
              </div>
            )}

            {/* Görseller */}
            <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading border-b border-border pb-2">Proje Görselleri</h2>

              <FileUpload
                multiple
                onMultipleChange={handleImageSelect}
              />

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {images.map((image, index) => (
                    <div key={image.id || image.url || image.preview} className="relative group">
                      <img src={image.preview} alt={`Görsel ${index + 1}`} className="w-full h-24 sm:h-28 lg:h-32 object-cover rounded-lg" />
                      {image.isCover && (
                        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-blue-500 text-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
                          Kapak
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteImageIndex(index)}
                        className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-danger hover:bg-danger-hover text-gray-50 p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer z-10"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {!image.isCover && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          style={{ backgroundColor: '#3b82f6' }}
                          className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-400 hover:bg-blue-600 transition-all text-[10px] sm:text-xs font-medium shadow-lg cursor-pointer"
                        >
                          Kapak Yap
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 sm:pt-6 border-t border-border">
              <Button type="button" variant="delete" onClick={() => setShowDeleteProjectDialog(true)} disabled={deleting} className="order-2 sm:order-1">
                {deleting ? "Siliniyor..." : "Projeyi Sil"}
              </Button>
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
                <Link href="/admin/projects">
                  <Button variant="cancel" type="button">İptal</Button>
                </Link>
                <Button type="submit" variant="save" disabled={loading || uploadingImages} loading={loading || uploadingImages}>
                  {uploadingImages ? "Görseller Yükleniyor..." : loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </div>
            </div>
          </form>
        </div>

      {/* Görsel Silme Onay Dialogu */}
      <ConfirmModal
        isOpen={deleteImageIndex !== null}
        title="Görseli Sil"
        message="Bu görseli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={confirmDeleteImage}
        onCancel={() => !deletingImage && setDeleteImageIndex(null)}
        isLoading={deletingImage}
      />

      {/* Proje Silme Onay Dialogu */}
      <ConfirmModal
        isOpen={showDeleteProjectDialog}
        title="Projeyi Sil"
        message="Bu projeyi silmek istediğinizden emin misiniz? Tüm görseller ve veriler silinecektir."
        confirmText="Projeyi Sil"
        cancelText="İptal"
        onConfirm={confirmDeleteProject}
        onCancel={() => setShowDeleteProjectDialog(false)}
        isLoading={deleting}
      />
    </div>
  )
}
