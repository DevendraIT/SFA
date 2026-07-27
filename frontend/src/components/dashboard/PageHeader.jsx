import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

