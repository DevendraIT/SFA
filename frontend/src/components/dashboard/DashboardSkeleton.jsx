export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-10 w-72 bg-slate-200 rounded" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-slate-200 rounded-xl" />
          <div className="h-10 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="space-y-2 mb-6">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-200 rounded" />
          </div>
          <div className="h-[300px] bg-slate-100 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="space-y-2 mb-6">
            <div className="h-5 w-32 bg-slate-200 rounded" />
          </div>
          <div className="h-[200px] bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

