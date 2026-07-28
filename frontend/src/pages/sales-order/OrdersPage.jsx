import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { ShoppingCart, RefreshCw, Loader2, DollarSign, Package, User, Clock, Filter, Plus } from "lucide-react";
import toast from "react-hot-toast";

import salesApi from "../../api/sales.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await salesApi.listOrders({ take: 100 });
      const data = res.data?.data || res.data;
      setOrders(Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load Sales Orders" onRetry={loadOrders} />;
  }

  const filteredOrders = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Sales Orders" subtitle="Manage and track customer sales orders">
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
          <p className="text-xs font-semibold text-blue-700 uppercase">Total Revenue</p>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
          <p className="text-xs font-semibold text-emerald-700 uppercase">Total Orders</p>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{orders.length}</p>
        </div>
        <div className="rounded-2xl bg-purple-50 border border-purple-200 p-5">
          <p className="text-xs font-semibold text-purple-700 uppercase">Completed</p>
          <p className="text-2xl font-extrabold text-purple-900 mt-1">
            {orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <SectionCard title="All Sales Orders" subtitle={`${filteredOrders.length} order(s)`} icon={ShoppingCart} iconColor="text-blue-600">
        {filteredOrders.length === 0 ? (
          <EmptyDashboard title="No Sales Orders" description="No orders found in the database." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">{o.orderNumber || o.id.slice(0, 8)}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{o.customer?.name || o.customerName || "N/A"}</td>
                    <td className="py-3.5 px-4 text-slate-500">{o.createdAt ? dayjs(o.createdAt).format("MMM D, YYYY") : "N/A"}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{Number(o.totalAmount || 0).toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">
                        {o.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
