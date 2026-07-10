import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { getDashboardData } from "../../api/dashboardApi.js";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export default function DashboardCharts() {
  const [roleData, setRoleData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [territoryData, setTerritoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    try {
      const data = await getDashboardData();

      // User Role Distribution
      const roleMap = {};

      data.users.forEach((user) => {
        const role = user.role || "Unknown";
        roleMap[role] = (roleMap[role] || 0) + 1;
      });

      setRoleData(
        Object.keys(roleMap).map((role) => ({
          name: role,
          value: roleMap[role],
        }))
      );

      // Branch Distribution
      setBranchData(
        data.branches.map((branch) => ({
          name: branch.branchName,
          value: 1,
        }))
      );

      // Territory Distribution
      setTerritoryData(
        data.territories.map((territory) => ({
          name: territory.territoryName,
          value: 1,
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="h-96 rounded-xl bg-gray-200 animate-pulse"></div>
        <div className="h-96 rounded-xl bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">

      {/* Role Distribution */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border dark:border-slate-700 p-6">

        <h2 className="text-xl font-bold mb-5 dark:text-white">
          User Role Distribution
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>

            <Pie
              data={roleData}
              dataKey="value"
              outerRadius={110}
              label
            >
              {roleData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Branch Distribution */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border dark:border-slate-700 p-6">

        <h2 className="text-xl font-bold mb-5 dark:text-white">
          Branch Distribution
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <BarChart data={branchData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8,8,0,0]}
              fill="#2563EB"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* Territory Distribution */}

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow border dark:border-slate-700 p-6">

        <h2 className="text-xl font-bold mb-5 dark:text-white">
          Territory Distribution
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <BarChart data={territoryData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#10B981"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}