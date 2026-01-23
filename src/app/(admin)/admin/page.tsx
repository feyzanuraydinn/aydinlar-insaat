import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/admin/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  })

  const projectCount = await prisma.project.count()
  const propertyCount = await prisma.property.count()

  const [
    homePageSettings,
    aboutPageSettings,
    projectsPageSettings,
    propertiesPageSettings,
    contactPageSettings
  ] = await Promise.all([
    prisma.homePageSettings.count(),
    prisma.aboutPageSettings.count(),
    prisma.projectsPageSettings.count(),
    prisma.propertiesPageSettings.count(),
    prisma.contactPageSettings.count()
  ])

  const settingsCount = homePageSettings + aboutPageSettings + projectsPageSettings + propertiesPageSettings + contactPageSettings

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">Yönetim Paneli</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Hoş geldiniz, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/admin/projects" className="block group">
          <div className="bg-surface border-2 border-primary-bg-hover rounded-xl p-4 sm:p-5 lg:p-6 hover:border-primary-light hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-heading">Projeler</h3>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">{projectCount}</p>
            <p className="text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">Toplam proje sayısı</p>
            <p className="text-xs sm:text-sm text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Yönetmek için tıklayın
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </div>
        </Link>

        <Link href="/admin/properties" className="block group">
          <div className="bg-surface border-2 border-success/30 rounded-xl p-4 sm:p-5 lg:p-6 hover:border-success hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-heading">Gayrimenkuller</h3>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success mb-1 sm:mb-2">{propertyCount}</p>
            <p className="text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">Toplam gayrimenkul sayısı</p>
            <p className="text-xs sm:text-sm text-success font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Yönetmek için tıklayın
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </div>
        </Link>

        <Link href="/admin/settings" className="block group sm:col-span-2 lg:col-span-1">
          <div className="bg-surface border-2 border-admin-primary/30 rounded-xl p-4 sm:p-5 lg:p-6 hover:border-admin-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-heading">Ayarlar</h3>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-admin-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-admin-primary mb-1 sm:mb-2">{settingsCount}</p>
            <p className="text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">Kayıtlı ayar sayısı</p>
            <p className="text-xs sm:text-sm text-admin-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Düzenlemek için tıklayın
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
