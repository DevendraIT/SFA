import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", sales: 120000 },
  { month: "Feb", sales: 180000 },
  { month: "Mar", sales: 155000 },
  { month: "Apr", sales: 240000 },
  { month: "May", sales: 275000 },
  { month: "Jun", sales: 310000 },
  { month: "Jul", sales: 360000 },
];

export default function SalesAnalytics() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Sales Analytics
          </h2>

          <p className="text-sm text-gray-500">
            Monthly sales performance
          </p>

        </div>

        <select className="border rounded-lg px-3 py-2">
          <option>Last 7 Months</option>
          <option>This Year</option>
        </select>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="sales"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2563EB"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="month" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#2563EB"
              fill="url(#sales)"
              strokeWidth={3}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}