export default function PageHeader({ title, subtitle, roleLabel, children }) {
  return (
    <div className="mb-6">
      <div className="sfa-card sfa-card-hover overflow-hidden">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-5 md:px-8 md:py-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                {roleLabel}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                SFA
              </h1>
              {title && title !== "SFA" && (
                <p className="mt-1 text-sm text-primary-100">{title}</p>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-primary-200/80">{subtitle}</p>
              )}
            </div>
            {children && <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">{children}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, children }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
