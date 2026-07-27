import { motion } from "framer-motion";

export default function SectionCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-600",
  action,
  children,
  className = "",
  hover = true,
  fullHeight = false,
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${
        fullHeight ? "h-full" : ""
      } ${className}`}
    >
      {(title || subtitle || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && <Icon size={24} className={iconColor} />}
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

