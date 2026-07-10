export function Input({
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          className={`sfa-input ${Icon ? "pl-10" : ""} ${
            error ? "border-rose-400 focus:ring-rose-500/40 focus:border-rose-400" : ""
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <select
        className={`sfa-input ${error ? "border-rose-400" : ""}`}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <textarea
        className={`sfa-input resize-none ${error ? "border-rose-400" : ""}`}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export default Input;
