import { Skeleton } from "./skeleton"

export function BookingsSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-4 gap-4">
        <Skeleton className="h-7 w-24 mb-4" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                {i < 3 && <Skeleton className="w-12 h-px" />}
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto flex gap-6">
            {/* Architect list */}
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
              <Skeleton className="h-4 w-40 mb-2" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-5 h-5 rounded-full" />
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="w-72 bg-white border border-gray-100 rounded-2xl p-5">
              <Skeleton className="h-4 w-28 mb-4" />
              <div className="grid grid-cols-7 gap-1 mb-2">
                {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-6 rounded" />)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => <Skeleton key={i} className="h-8 rounded-lg" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
