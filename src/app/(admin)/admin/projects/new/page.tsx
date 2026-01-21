"use client"

import { useState } from "react"
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
  DEED_STATUS_OPTIONS,
  LISTED_BY_OPTIONS,
  EXCHANGE_OPTIONS,
  COMMERCIAL_TYPE_OPTIONS,
} from "@/data/property-labels"

export default function NewProjectPage() {
  const router = useRouter()
  const toast = useToast()
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null)

  // Temel proje bilgileri
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    year: new Date().getFullYear().toString(),
    type: "", // RESIDENTIAL veya COMMERCIAL
    slug: "",
  })

  // Konut projesi detayları
  const [residentialData, setResidentialData] = useState({
    price: "",
    propertyType: "",
    grossArea: "",
    netArea: "",
    roomCount: "",
    housingType: "",
    buildingAge: "",
    currentFloor: "",
    totalFloors: "",
    heating: "",
    bathroomCount: "",
    kitchen: "",
    balcony: "",
    elevator: "",
    parking: "",
    furnished: "",
    usageStatus: "",
    inComplex: "",
    mortgageEligible: "",
    deedStatus: "",
    listedBy: "",
    exchange: "",
  })

  // Ticari proje detayları
  const [commercialData, setCommercialData] = useState({
    price: "",
    propertyType: "",
    commercialType: "",
    area: "",
    roomCount: "",
    heating: "",
    buildingAge: "",
    deedStatus: "",
    listedBy: "",
    exchange: "",
  })

  // Görseller
  const [images, setImages] = useState<{file: File, preview: string, isCover: boolean}[]>([])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Slug otomatik oluştur
    if (field === 'title') {
      const slug = value
        .toString()
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleResidentialChange = (field: string, value: any) => {
    setResidentialData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCommercialChange = (field: string, value: any) => {
    setCommercialData(prev => ({
      ...prev,
      [field]: value
    }))
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
          isCover: prev.length === 0 // İlk görsel otomatik kapak
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const confirmDeleteImage = () => {
    if (deleteImageIndex === null) return

    const indexToDelete = deleteImageIndex

    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== indexToDelete)
      if (prev[indexToDelete]?.isCover && newImages.length > 0) {
        newImages[0].isCover = true
      }
      return newImages
    })
    toast.success("Görsel başarıyla silindi")
    setDeleteImageIndex(null)
  }

  const setCoverImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isCover: i === index
    })))
  }

  const uploadImages = async (): Promise<{url: string, publicId?: string, alt: string, order: number, isCover: boolean}[]> => {
    if (images.length === 0) return []

    setUploadingImages(true)
    const uploadedImages: {url: string, publicId?: string, alt: string, order: number, isCover: boolean}[] = []

    try {
      for (let i = 0; i < images.length; i++) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", images[i].file)

        const data = await api.upload<{ url: string; publicId: string }>("/api/admin/upload", uploadFormData)

        if (!data) {
          throw new Error(api.error?.message || "Görsel yüklenemedi")
        }

        uploadedImages.push({
          url: data.url,
          publicId: data.publicId,
          alt: formData.title || `Proje görseli ${i + 1}`,
          order: i,
          isCover: images[i].isCover
        })
      }

      return uploadedImages
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validasyon
    if (!formData.type) {
      setError("Lütfen proje tipini seçin")
      return
    }

    if (images.length === 0) {
      setError("Lütfen en az bir görsel yükleyin")
      return
    }

    setLoading(true)

    try {
      // Görselleri yükle
      const uploadedImages = await uploadImages()

      // Proje verisini hazırla
      const projectData: any = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        year: formData.year,
        type: formData.type,
        slug: formData.slug,
        metaTitle: formData.title,
        metaDescription: formData.description.substring(0, 160),
        images: uploadedImages,
      }

      // Tip bazlı detayları ekle
      if (formData.type === "RESIDENTIAL") {
        projectData.residentialDetails = {
          price: residentialData.price ? parseFloat(residentialData.price) : null,
          propertyType: residentialData.propertyType || null,
          grossArea: residentialData.grossArea ? parseFloat(residentialData.grossArea) : null,
          netArea: residentialData.netArea ? parseFloat(residentialData.netArea) : null,
          roomCount: residentialData.roomCount || null,
          housingType: residentialData.housingType || null,
          buildingAge: residentialData.buildingAge || null,
          currentFloor: residentialData.currentFloor || null,
          totalFloors: residentialData.totalFloors || null,
          heating: residentialData.heating || null,
          bathroomCount: residentialData.bathroomCount || null,
          kitchen: residentialData.kitchen || null,
          balcony: residentialData.balcony || null,
          elevator: residentialData.elevator || null,
          parking: residentialData.parking || null,
          furnished: residentialData.furnished || null,
          usageStatus: residentialData.usageStatus || null,
          inComplex: residentialData.inComplex || null,
          mortgageEligible: residentialData.mortgageEligible || null,
          deedStatus: residentialData.deedStatus || null,
          listedBy: residentialData.listedBy || null,
          exchange: residentialData.exchange || null,
        }
      } else if (formData.type === "COMMERCIAL") {
        projectData.commercialDetails = {
          price: commercialData.price ? parseFloat(commercialData.price) : null,
          propertyType: commercialData.propertyType || null,
          commercialType: commercialData.commercialType || null,
          area: commercialData.area ? parseFloat(commercialData.area) : null,
          roomCount: commercialData.roomCount || null,
          heating: commercialData.heating || null,
          buildingAge: commercialData.buildingAge || null,
          deedStatus: commercialData.deedStatus || null,
          listedBy: commercialData.listedBy || null,
          exchange: commercialData.exchange || null,
        }
      }

      const result = await api.post<{ project: any }>("/api/admin/projects", projectData)

      if (!result) {
        throw new Error(api.error?.message || "Proje oluşturulamadı")
      }

      toast.success("Proje başarıyla oluşturuldu")
      router.push("/admin/projects")
      router.refresh()
    } catch (err: any) {
      const errorMessage = err.message || "Bir hata oluştu"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">Yeni Proje Ekle</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Tamamlanmış projenizi ekleyin</p>
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
                placeholder="Örn: Lüks Rezidans Projesi"
              />

              <Textarea
                label="Açıklama"
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                required
                rows={4}
                placeholder="Proje hakkında detaylı bilgi..."
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
                <LocationPicker
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
              </div>

              <Select
                label="Proje Tipi"
                value={formData.type}
                onChange={(value) => handleChange('type', value)}
                options={Object.entries(PROJECT_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                placeholder="Proje tipini seçin"
                required
              />
            </div>

            {/* Konut Detayları */}
            {formData.type === "RESIDENTIAL" && (
              <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading border-b border-border pb-2">Konut Projesi Detayları</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Input
                    label={RESIDENTIAL_LABELS.price}
                    type="number"
                    value={residentialData.price}
                    onChange={(value) => handleResidentialChange('price', value)}
                    placeholder="0"
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.propertyType}
                    value={residentialData.propertyType}
                    onChange={(value) => handleResidentialChange('propertyType', value)}
                    options={Object.entries(PROPERTY_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Input
                    label={RESIDENTIAL_LABELS.grossArea}
                    type="number"
                    value={residentialData.grossArea}
                    onChange={(value) => handleResidentialChange('grossArea', value)}
                  />

                  <Input
                    label={RESIDENTIAL_LABELS.netArea}
                    type="number"
                    value={residentialData.netArea}
                    onChange={(value) => handleResidentialChange('netArea', value)}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.roomCount}
                    value={residentialData.roomCount}
                    onChange={(value) => handleResidentialChange('roomCount', value)}
                    options={Object.entries(ROOM_COUNT_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.housingType}
                    value={residentialData.housingType}
                    onChange={(value) => handleResidentialChange('housingType', value)}
                    options={Object.entries(HOUSING_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.buildingAge}
                    value={residentialData.buildingAge}
                    onChange={(value) => handleResidentialChange('buildingAge', value)}
                    options={Object.entries(BUILDING_AGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.heating}
                    value={residentialData.heating}
                    onChange={(value) => handleResidentialChange('heating', value)}
                    options={Object.entries(HEATING_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.bathroomCount}
                    value={residentialData.bathroomCount}
                    onChange={(value) => handleResidentialChange('bathroomCount', value)}
                    options={Object.entries(BATHROOM_COUNT_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.balcony}
                    value={residentialData.balcony}
                    onChange={(value) => handleResidentialChange('balcony', value)}
                    options={Object.entries(BALCONY_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.elevator}
                    value={residentialData.elevator}
                    onChange={(value) => handleResidentialChange('elevator', value)}
                    options={Object.entries(ELEVATOR_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.parking}
                    value={residentialData.parking}
                    onChange={(value) => handleResidentialChange('parking', value)}
                    options={Object.entries(PARKING_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.currentFloor}
                    value={residentialData.currentFloor}
                    onChange={(value) => handleResidentialChange('currentFloor', value)}
                    options={Object.entries(CURRENT_FLOOR_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.totalFloors}
                    value={residentialData.totalFloors}
                    onChange={(value) => handleResidentialChange('totalFloors', value)}
                    options={Object.entries(TOTAL_FLOORS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.kitchen}
                    value={residentialData.kitchen}
                    onChange={(value) => handleResidentialChange('kitchen', value)}
                    options={Object.entries(KITCHEN_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.furnished}
                    value={residentialData.furnished}
                    onChange={(value) => handleResidentialChange('furnished', value)}
                    options={Object.entries(FURNISHED_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.usageStatus}
                    value={residentialData.usageStatus}
                    onChange={(value) => handleResidentialChange('usageStatus', value)}
                    options={Object.entries(USAGE_STATUS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.inComplex}
                    value={residentialData.inComplex}
                    onChange={(value) => handleResidentialChange('inComplex', value)}
                    options={Object.entries(IN_COMPLEX_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.mortgageEligible}
                    value={residentialData.mortgageEligible}
                    onChange={(value) => handleResidentialChange('mortgageEligible', value)}
                    options={Object.entries(MORTGAGE_ELIGIBLE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.deedStatus}
                    value={residentialData.deedStatus}
                    onChange={(value) => handleResidentialChange('deedStatus', value)}
                    options={Object.entries(DEED_STATUS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.listedBy}
                    value={residentialData.listedBy}
                    onChange={(value) => handleResidentialChange('listedBy', value)}
                    options={Object.entries(LISTED_BY_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={RESIDENTIAL_LABELS.exchange}
                    value={residentialData.exchange}
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
                    value={commercialData.price}
                    onChange={(value) => handleCommercialChange('price', value)}
                    placeholder="0"
                  />

                  <Select
                    label={COMMERCIAL_LABELS.propertyType}
                    value={commercialData.propertyType}
                    onChange={(value) => handleCommercialChange('propertyType', value)}
                    options={Object.entries(PROPERTY_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.commercialType}
                    value={commercialData.commercialType}
                    onChange={(value) => handleCommercialChange('commercialType', value)}
                    options={Object.entries(COMMERCIAL_TYPE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Input
                    label={COMMERCIAL_LABELS.area}
                    type="number"
                    value={commercialData.area}
                    onChange={(value) => handleCommercialChange('area', value)}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.roomCount}
                    value={commercialData.roomCount}
                    onChange={(value) => handleCommercialChange('roomCount', value)}
                    options={Object.entries(ROOM_COUNT_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.heating}
                    value={commercialData.heating}
                    onChange={(value) => handleCommercialChange('heating', value)}
                    options={Object.entries(HEATING_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.buildingAge}
                    value={commercialData.buildingAge}
                    onChange={(value) => handleCommercialChange('buildingAge', value)}
                    options={Object.entries(BUILDING_AGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.deedStatus}
                    value={commercialData.deedStatus}
                    onChange={(value) => handleCommercialChange('deedStatus', value)}
                    options={Object.entries(DEED_STATUS_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.listedBy}
                    value={commercialData.listedBy}
                    onChange={(value) => handleCommercialChange('listedBy', value)}
                    options={Object.entries(LISTED_BY_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />

                  <Select
                    label={COMMERCIAL_LABELS.exchange}
                    value={commercialData.exchange}
                    onChange={(value) => handleCommercialChange('exchange', value)}
                    options={Object.entries(EXCHANGE_OPTIONS).map(([key, label]) => ({ value: key, label }))}
                  />
                </div>
              </div>
            )}

            {/* Görseller */}
            <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading border-b border-border pb-2">Proje Görselleri *</h2>

              <FileUpload
                multiple
                onMultipleChange={handleImageSelect}
                helperText="İlk görsel otomatik olarak kapak olarak seçilir"
              />

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {images.map((image, index) => (
                    <div key={image.preview} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Görsel ${index + 1}`}
                        className="w-full h-24 sm:h-28 lg:h-32 object-cover rounded-lg"
                      />

                      {/* Kapak Badge */}
                      {image.isCover && (
                        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-blue-500 text-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
                          Kapak
                        </div>
                      )}

                      {/* Silme Butonu - Sağ Üst */}
                      <button
                        type="button"
                        onClick={() => setDeleteImageIndex(index)}
                        className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-danger hover:bg-danger-hover text-gray-50 p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer z-10"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Kapak Yap Butonu */}
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

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
              <Link href="/admin/projects">
                <Button variant="cancel" type="button">
                  İptal
                </Button>
              </Link>
              <Button
                type="submit"
                variant="save"
                disabled={loading || uploadingImages}
                loading={loading || uploadingImages}
              >
                {uploadingImages ? "Görseller Yükleniyor..." : loading ? "Kaydediliyor..." : "Projeyi Kaydet"}
              </Button>
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
        onCancel={() => setDeleteImageIndex(null)}
      />
    </div>
  )
}
