import { motion } from "framer-motion";

export default function PerformanceCard({
  title = "Performance",
  subtitle,
  icon: Icon,
  metrics = [],
}) {
  const getBarColor = (value) => {
    if (value >= 80) return "bg-emerald-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {Icon && <Icon size={26} className="text-blue-600" />}
      </div>

      <div className="space-y-5">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                {metric.label}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {metric.value}
                {metric.suffix || "%"}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metric.value, 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-2.5 rounded-full ${getBarColor(metric.value)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

