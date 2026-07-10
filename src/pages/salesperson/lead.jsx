import LeadStats from "../../components/salesperson/lead/leadstats.jsx";
import LeadFilters from "../../components/salesperson/lead/leadfilter.jsx";
import LeadTable from "../../components/salesperson/lead/leadtable.jsx";

export default function SPLeads() {
  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Leads
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all sales leads
          </p>

        </div>

        <button className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
          + Add Lead
        </button>

      </div>

      <LeadStats />

      <LeadFilters />

      <LeadTable />

    </div>
  );
}