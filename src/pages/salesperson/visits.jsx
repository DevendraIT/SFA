import VisitStats from "../../components/salesperson/visit/visitstats.jsx";
import VisitFilters from "../../components/salesperson/visit/visitfilter.jsx";
import VisitTable from "../../components/salesperson/visit/visittable.jsx";
import CheckInCard from "../../components/salesperson/visit/checkincard.jsx";

export default function SPVisits() {
  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Customer Visits
          </h1>

          <p className="text-slate-500 mt-2">
            Manage daily field visits and customer meetings
          </p>

        </div>

        <button className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
          + Schedule Visit
        </button>

      </div>

      <VisitStats />

      <CheckInCard />

      <VisitFilters />

      <VisitTable />

    </div>
  );
}