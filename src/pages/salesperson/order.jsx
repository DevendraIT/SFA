import OrderStats from "../../components/salesperson/order/orderstats.jsx";
import OrderFilters from "../../components/salesperson/order/orderfilter.jsx";
import OrderTable from "../../components/salesperson/order/ordertable.jsx";

export default function SPOrders() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer orders
          </p>

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
          + Create Order
        </button>

      </div>

      <OrderStats />

      <OrderFilters />

      <OrderTable />

    </div>
  );
}