const variants = {
  primary:
    "bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-md",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950/50",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  loading = false,
  ...props
}) {
  return (
    <button
      className={`sfa-btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
}
