interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-surface-hover via-border to-surface-hover bg-[length:200%_100%] rounded ${className}`}
      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
    />
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative h-[75vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden bg-hero">
      <div className="container relative z-10 flex items-center h-full px-6 sm:px-8 md:px-10 lg:px-4 mx-auto">
        <div className="grid items-center w-full grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="text-center animate-pulse">
            <div className="h-10 sm:h-12 md:h-14 w-3/4 mx-auto bg-white/20 rounded-lg mb-4 sm:mb-6" />

            <div className="h-8 sm:h-10 w-1/2 mx-auto bg-white/15 rounded-lg mb-4 sm:mb-6" />

            <div className="max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
              <div className="h-5 w-full bg-white/10 rounded" />
              <div className="h-5 w-5/6 mx-auto bg-white/10 rounded" />
              <div className="h-5 w-4/6 mx-auto bg-white/10 rounded" />
            </div>

            <div className="grid max-w-md grid-cols-3 gap-3 mx-auto mb-6 sm:gap-6 sm:mb-8 lg:max-w-none">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-8 sm:h-10 w-16 mx-auto bg-white/20 rounded-lg mb-1 sm:mb-2" />
                  <div className="h-4 w-20 mx-auto bg-white/10 rounded" />
                </div>
              ))}
            </div>

            <div className="flex flex-row justify-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-32 sm:w-40 bg-white/20 rounded-full" />
              <div className="h-10 sm:h-12 w-32 sm:w-40 bg-white/20 rounded-full" />
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center h-[400px] xl:h-[500px]">
            <div className="w-[480px] h-[300px] bg-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function CardSkeleton() {
  return (
    <div className="relative w-full max-w-[380px] aspect-[4/5] mb-6 mx-auto">
      <div className="w-full h-full rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] overflow-hidden bg-gradient-to-br from-surface-hover to-border animate-pulse">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-4">
          <div className="h-7 w-3/4 bg-border-dark/50 rounded-lg mb-4" />

          <div className="h-5 w-1/2 bg-border-dark/40 rounded-lg mb-3" />

          <div className="h-4 w-16 bg-border-dark/30 rounded-lg mb-5" />

          <div className="h-8 w-24 bg-primary/40 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function AdminCardSkeleton() {
  return (
    <div className="transition-shadow rounded-lg shadow bg-surface overflow-hidden animate-pulse">
      <div className="relative h-48 bg-gradient-to-br from-surface-hover to-border">
        <div className="absolute top-2 left-2 h-6 w-16 bg-border-dark/30 rounded" />
      </div>

      <div className="p-4">
        <div className="h-6 w-3/4 bg-surface-hover rounded mb-2" />

        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-surface-hover rounded mr-1" />
          <div className="h-4 w-1/2 bg-surface-hover rounded" />
        </div>

        <div className="h-4 w-20 bg-surface-hover rounded mb-3" />

        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-surface-hover rounded" />
            <div className="h-6 w-10 bg-surface-hover rounded-full" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-surface-hover rounded" />
            <div className="h-6 w-10 bg-surface-hover rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AdminCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full max-w-[150px]" />
        </td>
      ))}
    </tr>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number, columns?: number }) {
  return <AdminGridSkeleton count={rows} />
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ListPageHeroSkeleton({ statCount = 3 }: { statCount?: number }) {
  return (
    <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 overflow-hidden bg-hero">
      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center animate-pulse">
          <div className="h-8 sm:h-10 md:h-12 w-48 mx-auto bg-white/20 rounded-lg mb-4 sm:mb-6" />

          <div className="mb-6 sm:mb-8 space-y-2">
            <div className="h-5 w-full max-w-lg mx-auto bg-white/10 rounded" />
            <div className="h-5 w-3/4 max-w-md mx-auto bg-white/10 rounded" />
          </div>

          <div className={`grid grid-cols-${statCount} gap-4 sm:gap-6`}>
            {Array.from({ length: statCount }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 sm:h-10 w-12 sm:w-16 mx-auto bg-white/20 rounded-lg mb-1 sm:mb-2" />
                <div className="h-4 w-16 sm:w-20 mx-auto bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FilterSkeleton({ filterCount = 3 }: { filterCount?: number }) {
  return (
    <section className="py-6 sm:py-8 md:py-10 border-b border-border bg-surface">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: filterCount }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 sm:w-32 bg-surface-hover rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ListPageSkeleton({
  statCount = 3,
  filterCount = 3,
  cardCount = 6
}: {
  statCount?: number
  filterCount?: number
  cardCount?: number
}) {
  return (
    <div className="min-h-screen bg-surface">
      <ListPageHeroSkeleton statCount={statCount} />
      <FilterSkeleton filterCount={filterCount} />
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="container px-4 mx-auto">
          <GridSkeleton count={cardCount} />
        </div>
      </section>
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 overflow-hidden bg-hero">
        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-6xl mx-auto text-center animate-pulse">
            <div className="h-8 sm:h-10 md:h-12 w-2/3 mx-auto bg-white/20 rounded-lg mb-4 sm:mb-6" />

            <div className="h-6 w-1/3 mx-auto bg-white/15 rounded-lg mb-2" />

            <div className="h-5 w-16 mx-auto bg-white/10 rounded" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto lg:grid-cols-2">
            <div className="space-y-6 lg:order-2 animate-pulse">
              <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl" />

              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-16 sm:w-20 h-12 sm:h-16 bg-gray-200 rounded-lg" />
                ))}
              </div>

              <div className="p-4 sm:p-6 bg-gray-100 rounded-xl">
                <div className="h-6 w-32 bg-gray-200 rounded mb-3 sm:mb-4" />
                <div className="h-4 w-48 bg-gray-200 rounded mb-3 sm:mb-4" />
                <div className="h-40 sm:h-48 md:h-56 bg-gray-200 rounded-lg" />
              </div>
            </div>

            <div className="space-y-4 lg:order-1 animate-pulse">
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2 sm:mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-6 w-40 bg-gray-200 rounded" />

                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-gray-100">
                      <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
                      <div className="h-5 w-24 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <div className="h-10 w-40 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8 animate-pulse">
        <div className="h-8 w-48 bg-surface-hover rounded-lg mb-2" />
        <div className="h-5 w-64 bg-surface-hover rounded" />
      </div>

      <div className="bg-surface rounded-lg shadow animate-pulse">
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="h-6 w-32 bg-surface-hover rounded border-b border-border pb-2" />

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-surface-hover rounded mb-2" />
                  <div className="h-10 w-full bg-surface-hover rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
            <div className="h-6 w-40 bg-surface-hover rounded border-b border-border pb-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-surface-hover rounded mb-2" />
                  <div className="h-10 w-full bg-surface-hover rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 border-t border-border pt-6 sm:pt-8">
            <div className="h-6 w-36 bg-surface-hover rounded border-b border-border pb-2" />
            <div className="h-32 w-full bg-surface-hover rounded-lg border-2 border-dashed border-border" />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 sm:pt-6 border-t border-border">
            <div className="h-10 w-28 bg-danger/20 rounded-lg order-2 sm:order-1" />
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
              <div className="h-10 w-24 bg-surface-hover rounded-lg" />
              <div className="h-10 w-40 bg-primary/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4 sm:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface rounded-xl shadow-sm p-4 sm:p-5 lg:p-6 animate-pulse">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="h-5 w-24 bg-surface-hover rounded" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-surface-hover rounded" />
          </div>
          <div className="h-8 sm:h-10 w-16 bg-surface-hover rounded mb-1 sm:mb-2" />
          <div className="h-4 w-32 bg-surface-hover rounded" />
        </div>
      ))}
    </div>
  )
}

export function HomeSectionSkeleton({ cardCount = 3 }: { cardCount?: number }) {
  return (
    <section className="py-16 bg-surface">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center animate-pulse">
          <div className="h-10 w-64 mx-auto bg-surface-hover rounded-lg mb-4" />
          <div className="h-5 w-96 max-w-full mx-auto bg-surface-hover rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {Array.from({ length: cardCount }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div className="h-10 w-36 bg-surface-hover rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="bg-surface">
      <HeroSkeleton />

      <section className="py-16 sm:py-20 md:py-28 lg:py-32 xl:py-40 animate-pulse">
        <div className="px-4 mx-auto sm:px-6 md:px-8 max-w-7xl lg:px-12 xl:px-16">
          <div className="grid items-center grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 p-4 bg-surface rounded-lg sm:p-6 md:p-8 lg:order-1">
              <div className="h-6 w-3/4 bg-surface-hover rounded mb-4 sm:mb-6" />
              <div className="space-y-2 mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-surface-hover rounded" />
                ))}
              </div>
              <div className="flex gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-hover rounded-full" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-surface-hover rounded" />
                    <div className="h-4 w-20 bg-surface-hover rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-hover rounded-full" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-surface-hover rounded" />
                    <div className="h-4 w-28 bg-surface-hover rounded" />
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <div className="h-8 w-28 bg-surface-hover rounded-full" />
              </div>
            </div>

            <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[450px] xl:h-[500px] bg-surface-hover rounded-lg order-1 lg:order-2" />
          </div>
        </div>
      </section>

      <HomeSectionSkeleton cardCount={3} />

      <HomeSectionSkeleton cardCount={3} />
    </div>
  )
}

export function AdminListPageSkeleton({
  title,
  subtitle,
  cardCount = 6
}: {
  title: string
  subtitle: string
  cardCount?: number
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-heading">{title}</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">{subtitle}</p>
      </div>
      <AdminGridSkeleton count={cardCount} />
    </div>
  )
}
