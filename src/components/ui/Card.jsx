export default function Card({ children, className = "", gradient = false, hover = true, padding = true }) {
  return (
    <div
      className={`sfa-card ${hover ? "sfa-card-hover" : ""} ${
        gradient
          ? "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900"
          : ""
      } ${padding ? "" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function KPICard({ title, value, icon: Icon, color = "bg-primary-600", trend, subtitle }) {
  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-1 truncate text-2xl font-bold text-slate-800 dark:text-white md:text-3xl">
            {value}
          </h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          {trend !== undefined && (
            <p
              className={`mt-2 text-xs font-semibold ${
                trend >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`${color} flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-14 md:w-14`}
          >
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function StatCard({ label, value, change, positive }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-800 dark:text-white">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-semibold ${positive ? "text-emerald-500" : "text-rose-500"}`}>
          {change}
        </p>
      )}
    </Card>
  );
}
