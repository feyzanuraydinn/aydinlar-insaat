import Link from "next/link"
import Toggle from "@/components/admin/Toggle"
import Select from "@/components/admin/Select"

interface AdminCardProps {
  item: any
  type: "project" | "property"
  typeLabel: string
  featuredCount: number
  usedOrders: number[]
  onToggleFeatured: (itemId: string, currentFeatured: boolean, currentOrder: number | null) => void
  onUpdateFeaturedOrder: (itemId: string, order: number) => void
  onTogglePublished: (itemId: string, currentPublished: boolean) => void
}

export default function Card({
  item,
  type,
  typeLabel,
  featuredCount,
  usedOrders,
  onToggleFeatured,
  onUpdateFeaturedOrder,
  onTogglePublished,
}: AdminCardProps) {
  const coverImage = item.images.find((img: any) => img.isCover) || item.images[0]
  const editPath = type === "project" ? `/admin/projects/${item.id}` : `/admin/properties/${item.id}`

  const orderOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
  ]

  const isFeaturedToggleDisabled = !item.publishedAt || (!item.featured && featuredCount >= 3)

  return (
    <div className="transition-shadow rounded-lg shadow bg-surface hover:shadow-lg">
      <Link href={editPath} className="block overflow-hidden rounded-t-lg">
        <div className="relative h-36 sm:h-44 lg:h-48 bg-surface-hover">
          {coverImage ? (
            <img src={coverImage.url} alt={item.title} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-text-muted">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {item.featured && (
            <div className="absolute px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-primary rounded top-2 right-2 text-text-white">
              Öne Çıkan #{item.featuredOrder}
            </div>
          )}

          <div className="absolute px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold bg-primary rounded top-2 left-2 text-text-white">
            {typeLabel}
          </div>
        </div>

        <div className="p-3 sm:p-4 overflow-hidden">
          <h3 className="mb-1 text-sm sm:text-base lg:text-lg font-semibold text-text-primary transition-colors group-hover:text-primary line-clamp-1" title={item.title}>
            {item.title}
          </h3>
          <div className="flex items-center mb-1 text-xs sm:text-sm text-text-secondary">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location}</span>
          </div>
          {type === "project" && item.year && (
            <div className="flex items-center text-xs sm:text-sm text-text-secondary">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {item.year}
            </div>
          )}
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-text-tertiary line-clamp-2">
            {item.description}
          </p>
        </div>
      </Link>

      <div className="px-3 sm:px-4 pt-2.5 sm:pt-3 pb-3 sm:pb-4 space-y-2 border-t border-border rounded-b-lg">
        <Toggle
          enabled={!!item.publishedAt}
          onChange={() => onTogglePublished(item.id, !!item.publishedAt)}
          label="Yayınla"
          labelPosition="right"
        />

        <div className="relative flex items-center gap-2">
          <Toggle
            enabled={item.featured}
            onChange={() => {
              if (!isFeaturedToggleDisabled) {
                onToggleFeatured(item.id, item.featured, item.featuredOrder)
              }
            }}
            disabled={isFeaturedToggleDisabled}
            label={isFeaturedToggleDisabled && !item.publishedAt
              ? "Öne Çıkar"
              : isFeaturedToggleDisabled
                ? "Öne Çıkar (Maks. 3)"
                : "Öne Çıkar"}
            labelPosition="right"
          />

          {item.featured && item.publishedAt && (
            <div className="relative z-20 w-14 sm:w-16 ml-auto">
              <Select
                options={orderOptions}
                value={item.featuredOrder || 1}
                onChange={(value) => onUpdateFeaturedOrder(item.id, value as number)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
