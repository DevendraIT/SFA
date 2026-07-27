import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function QuickActions({ actions = [] }) {
  const navigate = useNavigate();

  if (!actions.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={index}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (action.onClick) {
                action.onClick();
              } else if (action.path) {
                navigate(action.path);
              }
            }}
            className={`rounded-xl border border-slate-200 p-5 hover:bg-slate-50 transition-all text-center ${
              action.color || ""
            }`}
          >
            <div className="flex justify-center">
              {Icon && <Icon size={26} className={action.iconColor || "text-blue-600"} />}
            </div>
            <p className="mt-3 font-semibold text-sm text-slate-700">
              {action.label}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

