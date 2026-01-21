"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import Button from "@/components/ui/Button"
import FileUpload from "@/components/admin/FileUpload"
import Input from "@/components/admin/Input"
import Textarea from "@/components/admin/Textarea"
import { useToast } from "@/components/admin/Toast"
import ConfirmDialog from "@/components/admin/ConfirmModal"
import { useApi } from "@/hooks/useApi"

// Leaflet'i sadece istemci tarafında yükle
const LocationPicker = dynamic(() => import("@/components/admin/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-surface-hover rounded-lg flex items-center justify-center">
      <div className="text-text-tertiary">Harita yükleniyor...</div>
    </div>
  )
})

interface HeroCard {
  id: string
  image: string
  publicId?: string
  title: string
  description: string
  order: number
}

interface TeamMember {
  id: string
  name: string
  profession: string
  phone: string
  email: string
  websiteUrl: string
  image: string
  publicId?: string
  order: number
}

interface Settings {
  homePage: {
    heroTitle: string
    heroSubtitle: string
    heroDefinition: string
    startYear: number
    completedProjects: number
    happyCustomers: number
  }
  aboutPage: {
    aboutTitle: string
    aboutSubtitle: string
    aboutDefinition: string
    aboutImage: string
    vision: string
    mission: string
  }
  projectsPage: {
    projectsTitle: string
  }
  propertiesPage: {
    propertiesTitle: string
  }
  contactPage: {
    contactTitle: string
    contactTeamDescription: string
    latitude: number | null
    longitude: number | null
  }
  footer: {
    description: string
    phone: string
    email: string
    address: string
  }
}

export default function SettingsPage() {
  const toast = useToast()
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'projects' | 'properties' | 'contact' | 'heroCards' | 'footer'>('home')
  const [heroCards, setHeroCards] = useState<HeroCard[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingMember, setSavingMember] = useState<string | null>(null)
  const [deletingMember, setDeletingMember] = useState<string | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [settings, setSettings] = useState<Settings>({
    homePage: {
      heroTitle: "",
      heroSubtitle: "",
      heroDefinition: "",
      startYear: new Date().getFullYear(),
      completedProjects: 0,
      happyCustomers: 0,
    },
    aboutPage: {
      aboutTitle: "",
      aboutSubtitle: "",
      aboutDefinition: "",
      aboutImage: "",
      vision: "",
      mission: "",
    },
    projectsPage: {
      projectsTitle: "",
    },
    propertiesPage: {
      propertiesTitle: "",
    },
    contactPage: {
      contactTitle: "",
      contactTeamDescription: "",
      latitude: null,
      longitude: null,
    },
    footer: {
      description: "",
      phone: "",
      email: "",
      address: "",
    },
  })

  useEffect(() => {
    fetchSettings()
    fetchHeroCards()
    fetchTeamMembers()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Settings API error:", response.status, errorData)
        throw new Error(errorData.error || errorData.message || `API hatası: ${response.status}`)
      }

      const data = await response.json()

      setSettings({
        homePage: data.homePage || settings.homePage,
        aboutPage: data.aboutPage || settings.aboutPage,
        projectsPage: data.projectsPage || settings.projectsPage,
        propertiesPage: data.propertiesPage || settings.propertiesPage,
        contactPage: {
          contactTitle: data.contactPage?.contactTitle || "",
          contactTeamDescription: data.contactPage?.contactTeamDescription || "",
          latitude: data.contactPage?.latitude || null,
          longitude: data.contactPage?.longitude || null,
        },
        footer: {
          description: data.footer?.description || "",
          phone: data.footer?.phone || "",
          email: data.footer?.email || "",
          address: data.footer?.address || "",
        },
      })
    } catch (err: any) {
      console.error("Settings page error:", err)
      setError(err.message || "Ayarlar yüklenirken hata oluştu")
    } finally {
      setFetching(false)
    }
  }

  const fetchHeroCards = async () => {
    try {
      const data = await api.get<{ heroCards: HeroCard[] }>("/api/admin/hero-cards")
      if (!data) throw new Error("Hero kartları yüklenemedi")

      const cards = data.heroCards || []

      // Ensure exactly 4 cards exist
      while (cards.length < 4) {
        cards.push({
          id: `new-${cards.length + 1}`,
          image: "",
          title: "",
          description: "",
          order: cards.length + 1
        })
      }

      setHeroCards(cards.slice(0, 4))
    } catch (err: any) {
      console.error("Hero cards fetch error:", err)
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const data = await api.get<{ teamMembers: TeamMember[] }>("/api/admin/team-members")
      if (!data) throw new Error("Ekip üyeleri yüklenemedi")

      setTeamMembers(data.teamMembers || [])
    } catch (err: any) {
      console.error("Team members fetch error:", err)
    }
  }

  const handleImageUpload = async (file: File): Promise<{ url: string; publicId: string }> => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const data = await api.upload<{ url: string; publicId: string }>("/api/admin/upload", formData)

      if (!data) throw new Error("Görsel yüklenemedi")

      return { url: data.url, publicId: data.publicId }
    } catch (err: any) {
      throw new Error(err.message || "Görsel yüklenirken hata oluştu")
    } finally {
      setUploadingImage(false)
    }
  }


  const handleHeroCardChange = (id: string, field: keyof HeroCard, value: string | number) => {
    setHeroCards(prev => prev.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ))
  }

  const handleHeroCardImageUpload = async (id: string, file: File) => {
    try {
      const { url, publicId } = await handleImageUpload(file)
      setHeroCards(prev => prev.map(card =>
        card.id === id ? { ...card, image: url, publicId } : card
      ))
      toast.success("Görsel başarıyla yüklendi!")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleHeroCardImageRemove = async (card: HeroCard) => {
    // Delete from Cloudinary if publicId exists
    if (card.publicId) {
      try {
        await api.request('/api/admin/upload', {
          method: 'DELETE',
          body: JSON.stringify({ publicId: card.publicId })
        })
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err)
      }
    }

    // Update local state
    setHeroCards(prev => prev.map(c =>
      c.id === card.id ? { ...c, image: '', publicId: undefined } : c
    ))

    // If card exists in database (not a new card), update it
    if (!card.id.startsWith('new-')) {
      try {
        await api.put(`/api/admin/hero-cards/${card.id}`, {
          image: '',
          publicId: null,
          title: card.title,
          description: card.description,
          order: card.order
        })
        toast.success("Görsel silindi!")
      } catch (err: any) {
        toast.error("Görsel silinirken hata oluştu")
      }
    } else {
      toast.success("Görsel silindi!")
    }
  }

  const handleAboutImageUpload = async (file: File) => {
    try {
      const { url } = await handleImageUpload(file)
      handleChange('aboutPage', 'aboutImage', url)
      toast.success("Görsel başarıyla yüklendi!")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // Team Member Functions
  const handleTeamMemberChange = (id: string, field: keyof TeamMember, value: string | number) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  const handleTeamMemberImageUpload = async (id: string, file: File) => {
    try {
      const { url, publicId } = await handleImageUpload(file)
      setTeamMembers(prev => prev.map(member =>
        member.id === id ? { ...member, image: url, publicId } : member
      ))
      toast.success("Görsel başarıyla yüklendi!")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleTeamMemberImageRemove = async (member: TeamMember) => {
    // Delete from Cloudinary if publicId exists
    if (member.publicId) {
      try {
        await api.request('/api/admin/upload', {
          method: 'DELETE',
          body: JSON.stringify({ publicId: member.publicId })
        })
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err)
      }
    }

    // Update local state
    setTeamMembers(prev => prev.map(m =>
      m.id === member.id ? { ...m, image: '', publicId: undefined } : m
    ))

    // If member exists in database (not a new member), update it
    if (!member.id.startsWith('new-')) {
      try {
        await api.put(`/api/admin/team-members/${member.id}`, {
          name: member.name,
          profession: member.profession,
          phone: member.phone,
          email: member.email,
          websiteUrl: member.websiteUrl,
          image: '',
          publicId: null,
          order: member.order
        })
        toast.success("Görsel silindi!")
      } catch (err: any) {
        toast.error("Görsel silinirken hata oluştu")
      }
    } else {
      toast.success("Görsel silindi!")
    }
  }

  const addNewTeamMember = () => {
    const newMember: TeamMember = {
      id: `new-${Date.now()}`,
      name: "",
      profession: "",
      phone: "",
      email: "",
      websiteUrl: "",
      image: "",
      order: teamMembers.length
    }
    setTeamMembers(prev => [...prev, newMember])
  }

  const handleSaveTeamMember = async (member: TeamMember) => {
    setSavingMember(member.id)

    try {
      if (!member.name || !member.phone || !member.email || !member.image) {
        throw new Error("İsim, telefon, e-posta ve görsel zorunludur")
      }

      const isNew = member.id.startsWith('new-')
      const url = isNew ? "/api/admin/team-members" : `/api/admin/team-members/${member.id}`

      const memberData = {
        name: member.name,
        profession: member.profession,
        phone: member.phone,
        email: member.email,
        websiteUrl: member.websiteUrl,
        image: member.image,
        publicId: member.publicId,
        order: member.order
      }

      const result = isNew
        ? await api.post<{ teamMember: TeamMember }>(url, memberData)
        : await api.put<{ teamMember: TeamMember }>(url, memberData)

      if (!result) {
        throw new Error(api.error?.message || "Kayıt başarısız")
      }

      toast.success("Ekip üyesi başarıyla kaydedildi!")
      await fetchTeamMembers()
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu")
    } finally {
      setSavingMember(null)
    }
  }

  // Üyenin herhangi bir alanında veri var mı kontrol et
  const memberHasData = (member: TeamMember): boolean => {
    return !!(member.name || member.profession || member.phone || member.email || member.websiteUrl || member.image)
  }

  // Silme butonuna tıklandığında
  const handleDeleteClick = (member: TeamMember) => {
    // Eğer üyede herhangi bir veri varsa onay modal'ı göster
    if (memberHasData(member)) {
      setMemberToDelete(member)
      setShowDeleteModal(true)
    } else {
      // Veri yoksa direkt sil
      handleDeleteTeamMember(member.id)
    }
  }

  const handleDeleteTeamMember = async (memberId: string) => {
    // Yeni eklenen ama henüz kaydedilmemiş üyeyi direkt sil
    if (memberId.startsWith('new-')) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId))
      setShowDeleteModal(false)
      setMemberToDelete(null)
      return
    }

    setDeletingMember(memberId)

    try {
      const result = await api.del(`/api/admin/team-members/${memberId}`)

      if (!result) {
        throw new Error(api.error?.message || "Silme başarısız")
      }

      toast.success("Ekip üyesi silindi!")
      await fetchTeamMembers()
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu")
    } finally {
      setDeletingMember(null)
      setShowDeleteModal(false)
      setMemberToDelete(null)
    }
  }

  const handleSaveHeroCard = async (card: HeroCard) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!card.image || !card.title || !card.description) {
        throw new Error("Tüm alanları doldurun")
      }

      const isNew = card.id.startsWith('new-')
      const url = isNew ? "/api/admin/hero-cards" : `/api/admin/hero-cards/${card.id}`

      const cardData = {
        image: card.image,
        publicId: card.publicId,
        title: card.title,
        description: card.description,
        order: card.order
      }

      const result = isNew
        ? await api.post<{ heroCard: HeroCard }>(url, cardData)
        : await api.put<{ heroCard: HeroCard }>(url, cardData)

      if (!result) {
        throw new Error(api.error?.message || "Kayıt başarısız")
      }

      toast.success("Hero kartı başarıyla kaydedildi!")
      await fetchHeroCards()
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }


  const handleChange = (
    section: keyof Settings,
    field: string,
    value: string | number
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (section: keyof Settings) => {
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const result = await api.put<any>("/api/admin/settings", {
        type: section,
        data: settings[section],
      })

      if (!result) {
        throw new Error(api.error?.message || "Güncelleme başarısız")
      }

      toast.success("Ayarlar başarıyla güncellendi!")
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-secondary">Yükleniyor...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'home' as const, label: 'Ana Sayfa' },
    { id: 'heroCards' as const, label: 'Hero Kartları' },
    { id: 'about' as const, label: 'Hakkımızda' },
    { id: 'projects' as const, label: 'Projeler' },
    { id: 'properties' as const, label: 'Gayrimenkuller' },
    { id: 'contact' as const, label: 'İletişim' },
    { id: 'footer' as const, label: 'Footer' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">Genel Ayarlar</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Web sitesinin genel içeriklerini buradan düzenleyebilirsiniz.</p>
      </div>

      {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success/10 border border-success/30 text-success px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-surface rounded-lg shadow mb-4 sm:mb-6">
          <div className="border-b border-border overflow-x-auto overflow-y-hidden">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs lg:text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap text-center ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Ana Sayfa Ayarları */}
        {activeTab === 'home' && (
          <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-4 sm:mb-6">Ana Sayfa Ayarları</h2>

            <div className="space-y-4 sm:space-y-6">
              <Input
                label="Hero Başlık"
                type="text"
                value={settings.homePage.heroTitle}
                onChange={(value) => handleChange('homePage', 'heroTitle', value)}
                placeholder="Ana sayfa başlığı"
              />

              <Input
                label="Hero Alt Başlık"
                type="text"
                value={settings.homePage.heroSubtitle}
                onChange={(value) => handleChange('homePage', 'heroSubtitle', value)}
                placeholder="Alt başlık"
              />

              <Textarea
                label="Hero Açıklama"
                value={settings.homePage.heroDefinition}
                onChange={(value) => handleChange('homePage', 'heroDefinition', value)}
                placeholder="Açıklama metni"
                rows={4}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Input
                  label="Başlangıç Yılı"
                  type="number"
                  value={settings.homePage.startYear}
                  onChange={(value) => handleChange('homePage', 'startYear', parseInt(value))}
                  placeholder="2000"
                  helperText="Deneyim yılı hesaplanır"
                />

                <Input
                  label="Tamamlanan Proje Sayısı"
                  type="number"
                  value={settings.homePage.completedProjects}
                  onChange={(value) => handleChange('homePage', 'completedProjects', parseInt(value))}
                  placeholder="100"
                />

                <Input
                  label="Mutlu Müşteri Sayısı"
                  type="number"
                  value={settings.homePage.happyCustomers}
                  onChange={(value) => handleChange('homePage', 'happyCustomers', parseInt(value))}
                  placeholder="500"
                />
              </div>

              <div className="flex justify-end pt-4 sm:pt-6 border-t">
                <Button
                  onClick={() => handleSubmit('homePage')}
                  variant="save"
                  disabled={loading}
                  loading={loading}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hakkımızda Ayarları */}
        {activeTab === 'about' && (
          <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-4 sm:mb-6">Hakkımızda Ayarları</h2>

            <div className="space-y-4 sm:space-y-6">
              <Input
                label="Hakkımızda Başlık"
                type="text"
                value={settings.aboutPage.aboutTitle}
                onChange={(value) => handleChange('aboutPage', 'aboutTitle', value)}
              />

              <Input
                label="Alt Başlık"
                type="text"
                value={settings.aboutPage.aboutSubtitle}
                onChange={(value) => handleChange('aboutPage', 'aboutSubtitle', value)}
              />

              <Textarea
                label="Açıklama"
                value={settings.aboutPage.aboutDefinition}
                onChange={(value) => handleChange('aboutPage', 'aboutDefinition', value)}
                rows={6}
              />

              <FileUpload
                label="Hakkımızda Görseli"
                value={settings.aboutPage.aboutImage}
                onChange={(file) => {
                  if (file) handleAboutImageUpload(file)
                }}
                onRemove={() => handleChange('aboutPage', 'aboutImage', '')}
                accept="image/*"
                helperText={uploadingImage ? "Görsel yükleniyor..." : "PNG, JPG veya JPEG formatında görsel yükleyin."}
                disabled={uploadingImage}
                confirmDelete
              />

              <Textarea
                label="Vizyonumuz"
                value={settings.aboutPage.vision}
                onChange={(value) => handleChange('aboutPage', 'vision', value)}
                rows={4}
              />

              <Textarea
                label="Misyonumuz"
                value={settings.aboutPage.mission}
                onChange={(value) => handleChange('aboutPage', 'mission', value)}
                rows={4}
              />

              <div className="flex justify-end pt-4 sm:pt-6 border-t">
                <Button
                  onClick={() => handleSubmit('aboutPage')}
                  variant="save"
                  disabled={loading}
                  loading={loading}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Projeler Ayarları */}
        {activeTab === 'projects' && (
          <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-4 sm:mb-6">Projeler Sayfası Ayarları</h2>

            <div className="space-y-4 sm:space-y-6">
              <Input
                label="Sayfa Başlığı"
                type="text"
                value={settings.projectsPage.projectsTitle}
                onChange={(value) => handleChange('projectsPage', 'projectsTitle', value)}
                placeholder="Projelerimiz"
              />

              <div className="flex justify-end pt-4 sm:pt-6 border-t">
                <Button
                  onClick={() => handleSubmit('projectsPage')}
                  variant="save"
                  disabled={loading}
                  loading={loading}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Gayrimenkuller Ayarları */}
        {activeTab === 'properties' && (
          <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-4 sm:mb-6">Gayrimenkuller Sayfası Ayarları</h2>

            <div className="space-y-4 sm:space-y-6">
              <Input
                label="Sayfa Başlığı"
                type="text"
                value={settings.propertiesPage.propertiesTitle}
                onChange={(value) => handleChange('propertiesPage', 'propertiesTitle', value)}
                placeholder="Gayrimenkullerimiz"
              />

              <div className="flex justify-end pt-4 sm:pt-6 border-t">
                <Button
                  onClick={() => handleSubmit('propertiesPage')}
                  variant="save"
                  disabled={loading}
                  loading={loading}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* İletişim Ayarları */}
        {activeTab === 'contact' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Genel İletişim Ayarları */}
            <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-4 sm:mb-6">İletişim Sayfası Ayarları</h2>

              <div className="space-y-4 sm:space-y-6">
                <Input
                  label="Sayfa Başlığı"
                  type="text"
                  value={settings.contactPage.contactTitle}
                  onChange={(value) => handleChange('contactPage', 'contactTitle', value)}
                  placeholder="İletişim"
                />

                <Textarea
                  label="Ekip Açıklaması"
                  value={settings.contactPage.contactTeamDescription}
                  onChange={(value) => handleChange('contactPage', 'contactTeamDescription', value)}
                  placeholder="Ekibimizle iletişime geçin..."
                  rows={4}
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2.5">
                    Ofis Konumu (Harita)
                  </label>
                  {!fetching && (
                    <LocationPicker
                      key={`${settings.contactPage.latitude}-${settings.contactPage.longitude}`}
                      latitude={settings.contactPage.latitude}
                      longitude={settings.contactPage.longitude}
                      onLocationChange={(lat, lng) => {
                        setSettings(prev => ({
                          ...prev,
                          contactPage: {
                            ...prev.contactPage,
                            latitude: lat,
                            longitude: lng,
                          }
                        }))
                      }}
                    />
                  )}
                  {fetching && (
                    <div className="w-full h-96 bg-surface-hover rounded-lg flex items-center justify-center">
                      <div className="text-text-tertiary">Harita yükleniyor...</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 sm:pt-6 border-t">
                  <Button
                    onClick={() => handleSubmit('contactPage')}
                    variant="save"
                    disabled={loading}
                    loading={loading}
                  >
                    Kaydet
                  </Button>
                </div>
              </div>
            </div>

            {/* Ekip Üyeleri */}
            <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading">Ekip Üyeleri</h2>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">İletişim sayfasında görüntülenen ekip üyelerini yönetin</p>
                </div>
                <Button variant="add" onClick={addNewTeamMember}>
                  Yeni Üye Ekle
                </Button>
              </div>

              {teamMembers.length === 0 ? (
                <div className="text-center py-8 sm:py-12 border-2 border-dashed border-border rounded-lg">
                  <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="mt-2 text-xs sm:text-sm font-medium text-text-heading">Ekip üyesi bulunmuyor</h3>
                  <p className="mt-1 text-xs sm:text-sm text-text-tertiary">Yukarıdaki butonu kullanarak yeni bir ekip üyesi ekleyin.</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {teamMembers.map((member, index) => (
                    <div key={member.id} className="border border-border rounded-lg p-4 sm:p-5 lg:p-6 bg-surface">
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-base lg:text-lg font-medium text-text-heading">
                          {member.name || `Üye ${index + 1}`}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="md:col-span-2">
                          <FileUpload
                            label="Profil Görseli"
                            value={member.image}
                            onChange={(file) => {
                              if (file) handleTeamMemberImageUpload(member.id, file)
                            }}
                            onRemove={() => handleTeamMemberImageRemove(member)}
                            accept="image/*"
                            helperText={uploadingImage ? "Görsel yükleniyor..." : "PNG, JPG veya JPEG formatında görsel yükleyin."}
                            disabled={uploadingImage}
                            confirmDelete
                          />
                        </div>

                        <Input
                          label="İsim Soyisim"
                          type="text"
                          value={member.name}
                          onChange={(value) => handleTeamMemberChange(member.id, 'name', value)}
                          placeholder="Ahmet Yılmaz"
                          required
                        />

                        <Input
                          label="Ünvan / Meslek (Opsiyonel)"
                          type="text"
                          value={member.profession}
                          onChange={(value) => handleTeamMemberChange(member.id, 'profession', value)}
                          placeholder="Satış Müdürü"
                        />

                        <Input
                          label="Telefon"
                          type="tel"
                          value={member.phone}
                          onChange={(value) => handleTeamMemberChange(member.id, 'phone', value)}
                          placeholder="555 123 45 67"
                          required
                        />

                        <Input
                          label="E-posta"
                          type="email"
                          value={member.email}
                          onChange={(value) => handleTeamMemberChange(member.id, 'email', value)}
                          placeholder="ahmet@aydinlarinsaat.com"
                          required
                        />

                        <Input
                          label="Web Sitesi URL (Opsiyonel)"
                          type="text"
                          value={member.websiteUrl}
                          onChange={(value) => handleTeamMemberChange(member.id, 'websiteUrl', value)}
                          placeholder="https://linkedin.com/in/ahmetyilmaz"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t">
                        <Button
                          onClick={() => handleDeleteClick(member)}
                          variant="delete"
                          disabled={deletingMember === member.id}
                          loading={deletingMember === member.id}
                        >
                          Üyeyi Sil
                        </Button>
                        <Button
                          onClick={() => handleSaveTeamMember(member)}
                          variant="save"
                          disabled={savingMember === member.id || !member.name || !member.phone || !member.email || !member.image}
                          loading={savingMember === member.id}
                        >
                          {member.id.startsWith('new-') ? 'Üyeyi Kaydet' : 'Güncelle'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Kartları */}
        {activeTab === 'heroCards' && (
          <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading">Hero Kartları</h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">Ana sayfada gösterilen 4 kart (Sabit 4 kart - silinemez)</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {heroCards.map((card, index) => (
                <div key={card.id} className="border border-border rounded-lg p-4 sm:p-5 lg:p-6 bg-surface">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium text-text-heading">Kart {index + 1}</h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <FileUpload
                      label="Görsel"
                      value={card.image}
                      onChange={(file) => {
                        if (file) handleHeroCardImageUpload(card.id, file)
                      }}
                      onRemove={() => handleHeroCardImageRemove(card)}
                      accept="image/*"
                      helperText={uploadingImage ? "Görsel yükleniyor..." : "PNG, JPG veya JPEG formatında görsel yükleyin."}
                      disabled={uploadingImage}
                      confirmDelete
                    />

                    <Input
                      label="Başlık"
                      type="text"
                      value={card.title}
                      onChange={(value) => handleHeroCardChange(card.id, 'title', value)}
                      placeholder="Kart başlığı"
                    />

                    <Textarea
                      label="Açıklama"
                      value={card.description}
                      onChange={(value) => handleHeroCardChange(card.id, 'description', value)}
                      placeholder="Kart açıklaması"
                      rows={3}
                    />

                    <div className="flex justify-end pt-3 sm:pt-4 border-t">
                      <Button
                        onClick={() => handleSaveHeroCard(card)}
                        variant="save"
                        disabled={loading || !card.image || !card.title || !card.description}
                      >
                        Kartı Kaydet
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Ayarları */}
        {activeTab === 'footer' && (
          <div className="bg-surface rounded-lg shadow p-4 sm:p-5 lg:p-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-4 sm:mb-6">Footer Ayarları</h2>

            <div className="space-y-4 sm:space-y-6">
              <Textarea
                label="Açıklama"
                value={settings.footer.description}
                onChange={(value) => handleChange('footer', 'description', value)}
                placeholder="Kaliteli inşaat hizmetleri ve güvenilir gayrimenkul çözümleri."
                rows={3}
              />

              <Input
                label="Telefon"
                type="tel"
                value={settings.footer.phone}
                onChange={(value) => handleChange('footer', 'phone', value)}
                placeholder="444 91 37"
              />

              <Input
                label="E-posta"
                type="email"
                value={settings.footer.email}
                onChange={(value) => handleChange('footer', 'email', value)}
                placeholder="info@aydinlarinsaat.com"
              />

              <Input
                label="Adres"
                type="text"
                value={settings.footer.address}
                onChange={(value) => handleChange('footer', 'address', value)}
                placeholder="Kocaeli, Türkiye"
              />

              <div className="flex justify-end pt-4 sm:pt-6 border-t">
                <Button
                  onClick={() => handleSubmit('footer')}
                  variant="save"
                  disabled={loading}
                  loading={loading}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* Ekip Üyesi Silme Onay Modal'ı */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Ekip Üyesini Sil"
        message={`"${memberToDelete?.name || 'Bu üye'}" adlı ekip üyesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        confirmVariant="delete"
        onConfirm={() => memberToDelete && handleDeleteTeamMember(memberToDelete.id)}
        onCancel={() => {
          setShowDeleteModal(false)
          setMemberToDelete(null)
        }}
        isLoading={deletingMember === memberToDelete?.id}
      />
    </div>
  )
}
