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
  { month: "Mar", sales: 160000 },
  { month: "Apr", sales: 240000 },
  { month: "May", sales: 280000 },
  { month: "Jun", sales: 310000 },
  { month: "Jul", sales: 360000 },
];

export default function SalesTrendChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Sales Trend
      </h2>

      <div className="h-80">

        <ResponsiveContainer>

          <AreaChart data={data}>

            <defs>

              <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">

                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />

                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />

              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="4 4"/>

            <XAxis dataKey="month"/>

            <Tooltip/>

            <Area
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