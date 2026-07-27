import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const statusColors = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
};

export default function RecentOrders({
  orders = [],
  emptyMessage = "No orders yet.",
  viewAllLink,
}) {
  return (
    <div>
      {!orders.length ? (
        <div className="py-10 text-center text-slate-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-slate-50 hover:bg-slate-50 transition"
                >
                  <td className="py-4 font-semibold text-slate-800 text-sm">
                    {order.orderNumber || order.id?.slice(0, 8) || "N/A"}
                  </td>
                  <td className="py-4 text-sm text-slate-600">
                    {order.customer?.name || order.customerName || "-"}
                  </td>
                  <td className="py-4 text-sm font-semibold text-slate-800">
                    ₹
                    {Number(
                      order.totalAmount || order.amount || 0
                    ).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.status || "DRAFT"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

