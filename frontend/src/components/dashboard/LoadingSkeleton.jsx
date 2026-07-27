export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
      <div className="space-y-4">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-32 bg-slate-200 rounded" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-200 rounded"
            style={{ width: `${60 + i * 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
      <div className="space-y-4">
        <div className="flex gap-6 pb-4 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 flex-1 bg-slate-200 rounded" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-6 py-3">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 flex-1 bg-slate-200 rounded"
                style={{ opacity: 1 - c * 0.15 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-3 w-56 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>
      <div className="h-[300px] bg-slate-100 rounded-xl" />
    </div>
  );
}

export function DashboardGridSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-10 w-72 bg-slate-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-slate-200 rounded-xl" />
          <div className="h-10 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    </div>
  );
}

