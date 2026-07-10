import { useMemo, useState } from "react";
import { ShoppingCart, TrendingUp, PackageCheck, Clock3 } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useStorage } from "../../hooks/useLocalStorage.js";
import { formatCurrency, formatDate } from "../../utils/helpers.js";

export default function Orders() {
  const { data: orders, update } = useStorage("orders");
  const [filter, setFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const totalValue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

  const nextStatus = (order) => {
    const next = order.status === "Pending" ? "Approved" : order.status === "Approved" ? "Delivered" : "Pending";
    update(order.id, { status: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage customer orders from booking to delivery.</p>
        </div>
        <div className="flex gap-2">
          {['All','Pending','Approved','Delivered'].map((status) => (
            <Button key={status} size="sm" variant={filter === status ? 'primary' : 'secondary'} onClick={() => setFilter(status)}>{status}</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600"><ShoppingCart size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Total orders</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{orders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600"><TrendingUp size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><Clock3 size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{orders.filter((order) => order.status === "Pending").length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{order.customer || order.orderId || "Order"}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : order.status === "Approved" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}>{order.status || "Pending"}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Amount: {formatCurrency(order.amount || 0)}</p>
                <p className="text-sm text-slate-500">Date: {formatDate(order.orderDate || order.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" icon={PackageCheck}>View</Button>
                <Button size="sm" onClick={() => nextStatus(order)}>Advance</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}