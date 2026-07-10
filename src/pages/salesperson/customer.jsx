import CustomerStats from "../../components/salesperson/customer/customerstats.jsx";
import CustomerFilters from "../../components/salesperson/customer/customerfilter.jsx";
import CustomerTable from "../../components/salesperson/customer/customertable.jsx";

export default function SPCustomers() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Customers
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all your customers and retail outlets
          </p>

        </div>

        <button className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow">
          + Add Customer
        </button>

      </div>

      <CustomerStats />

      <CustomerFilters />

      <CustomerTable />

    </div>
  );
}