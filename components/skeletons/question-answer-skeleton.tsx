import { Skeleton } from "./skeleton"

export function QuestionAnswerSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-4 gap-4">
        <Skeleton className="h-7 w-24 mb-4" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <Skeleton className="h-6 w-36" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex gap-5 p-6">
          {/* Chat area */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-5 pt-5 pb-4 border-b border-gray-100">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>

            {/* Consultant header */}
            <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-50">
              <Skeleton className="w-11 h-11 rounded-full" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-6 py-5 flex flex-col gap-5">
              {/* User message */}
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-12 w-72 rounded-2xl" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              {/* Consultant message */}
              <div className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-28 w-96 rounded-2xl" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
              {/* User message */}
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-10 w-48 rounded-2xl" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-gray-100">
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-72 flex flex-col gap-4 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
              <Skeleton className="h-4 w-40" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-52 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
