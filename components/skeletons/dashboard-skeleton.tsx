import { Skeleton } from "./skeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-4 gap-4">
        <Skeleton className="h-7 w-24 mb-4" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-5">
            {/* Left column */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              {/* Banner */}
              <Skeleton className="h-24 w-full rounded-2xl" />

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start justify-between">
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* Q&A */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex gap-3">
                      <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                      <div className="flex-1 flex flex-col gap-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation rows */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-12" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <Skeleton className="h-3 flex-1" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-9 rounded-xl" />
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                <Skeleton className="h-4 w-20" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <div className="flex-1 flex flex-col gap-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-44 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
