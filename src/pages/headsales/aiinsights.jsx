// src/pages/headsales/AIInsights.jsx

import React from "react";
import {
  Brain,
  TrendingUp,
  DollarSign,
  Users,
  Sparkles,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

const leadSuggestions = [
  {
    id: 1,
    customer: "ABC Traders",
    score: "98%",
    opportunity: "High",
    recommendation: "Follow up within 24 hours",
  },
  {
    id: 2,
    customer: "Royal Distributors",
    score: "94%",
    opportunity: "High",
    recommendation: "Offer premium package",
  },
  {
    id: 3,
    customer: "Shree Agencies",
    score: "90%",
    opportunity: "Medium",
    recommendation: "Schedule product demo",
  },
  {
    id: 4,
    customer: "City Mart",
    score: "88%",
    opportunity: "Medium",
    recommendation: "Send promotional offer",
  },
];

export default function HOSAiInsights() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            AI Insights
          </h1>

          <p className="text-gray-500 mt-1">
            AI-powered sales intelligence and business recommendations
          </p>
        </div>

        <button className="mt-4 lg:mt-0 bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">

          <Sparkles size={18} />

          Generate Insights

        </button>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-5">

          <Brain className="text-indigo-600" size={34} />

          <p className="text-gray-500 mt-3">
            AI Accuracy
          </p>

          <h2 className="text-3xl font-bold mt-2">
            96%
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <TrendingUp className="text-green-600" size={34} />

          <p className="text-gray-500 mt-3">
            Sales Prediction
          </p>

          <h2 className="text-3xl font-bold mt-2">
            +18%
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <DollarSign className="text-blue-600" size={34} />

          <p className="text-gray-500 mt-3">
            Revenue Forecast
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹18.5L
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <Users className="text-orange-500" size={34} />

          <p className="text-gray-500 mt-3">
            New Opportunities
          </p>

          <h2 className="text-3xl font-bold mt-2">
            46
          </h2>

        </div>

      </div>

      {/* Revenue Forecast */}

      <div className="bg-linear-to-r from-indigo-600 to-blue-600 rounded-xl text-white shadow p-8">

        <h2 className="text-2xl font-bold">
          AI Revenue Forecast
        </h2>

        <p className="mt-4 text-indigo-100">

          Based on previous sales performance, market trends and customer
          behaviour, AI predicts next month's revenue will reach

          <span className="font-bold text-white">
            {" "}₹18,50,000
          </span>

          with approximately

          <span className="font-bold text-white">
            {" "}14% growth.
          </span>

        </p>

        <button className="mt-6 bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100">

          View Detailed Forecast

        </button>

      </div>

      {/* Sales Prediction */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Sales Prediction
          </h2>

          {[
            {
              month: "July",
              value: "₹18.5L",
              progress: 88,
            },
            {
              month: "August",
              value: "₹20.2L",
              progress: 93,
            },
            {
              month: "September",
              value: "₹22.1L",
              progress: 98,
            },
          ].map((item) => (

            <div key={item.month} className="mb-6">

              <div className="flex justify-between mb-2">

                <span>{item.month}</span>

                <span className="font-semibold">
                  {item.value}
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${item.progress}%` }}
                ></div>

              </div>

            </div>

          ))}

        </div>

        {/* AI Summary */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            AI Summary
          </h2>

          <div className="space-y-5">

            <div className="flex gap-3">

              <ArrowUpRight className="text-green-600" />

              <p>
                Sales are expected to increase over the next quarter.
              </p>

            </div>

            <div className="flex gap-3">

              <ArrowUpRight className="text-green-600" />

              <p>
                West Zone continues to outperform all regions.
              </p>

            </div>

            <div className="flex gap-3">

              <ArrowUpRight className="text-yellow-500" />

              <p>
                Customer retention should be improved in North Zone.
              </p>

            </div>

            <div className="flex gap-3">

              <ArrowUpRight className="text-red-500" />

              <p>
                Product D sales are declining significantly.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* AI Lead Suggestions */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            AI Lead Suggestions
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">AI Score</th>
                <th className="p-4 text-left">Opportunity</th>
                <th className="p-4 text-left">Recommendation</th>

              </tr>

            </thead>

            <tbody>

              {leadSuggestions.map((lead) => (

                <tr
                  key={lead.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {lead.customer}
                  </td>

                  <td className="p-4 text-green-600 font-semibold">
                    {lead.score}
                  </td>

                  <td className="p-4">
                    {lead.opportunity}
                  </td>

                  <td className="p-4 flex items-center gap-2">

                    <Lightbulb
                      size={18}
                      className="text-yellow-500"
                    />

                    {lead.recommendation}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
            {/* Bottom Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

        {/* Customer Churn Prediction */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Customer Churn Prediction
          </h2>

          {[
            {
              customer: "ABC Traders",
              risk: "Low",
              progress: 15,
              color: "bg-green-500",
            },
            {
              customer: "Royal Mart",
              risk: "Medium",
              progress: 48,
              color: "bg-yellow-500",
            },
            {
              customer: "Shree Agencies",
              risk: "High",
              progress: 82,
              color: "bg-red-500",
            },
          ].map((item, index) => (

            <div key={index} className="mb-5">

              <div className="flex justify-between mb-2">

                <span>{item.customer}</span>

                <span className="font-semibold">
                  {item.risk}
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                  className={`${item.color} h-3 rounded-full`}
                  style={{ width: `${item.progress}%` }}
                ></div>

              </div>

            </div>

          ))}

        </div>

        {/* Smart Recommendations */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Smart Recommendations
          </h2>

          <div className="space-y-4">

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600">
                Increase Follow-ups
              </h4>

              <p className="text-sm text-gray-600 mt-1">
                18 potential customers haven't been contacted for
                more than 10 days.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-green-600">
                Upsell Opportunity
              </h4>

              <p className="text-sm text-gray-600 mt-1">
                Premium customers are likely to purchase Product X.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-purple-600">
                Improve Territory
              </h4>

              <p className="text-sm text-gray-600 mt-1">
                East Zone needs additional field visits this week.
              </p>
            </div>

          </div>

        </div>

        {/* Risk Analysis */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Risk Analysis
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Revenue Risk</span>

              <span className="text-red-600 font-semibold">
                Medium
              </span>

            </div>

            <div className="flex justify-between">

              <span>Customer Churn</span>

              <span className="text-yellow-600 font-semibold">
                Moderate
              </span>

            </div>

            <div className="flex justify-between">

              <span>Target Achievement</span>

              <span className="text-green-600 font-semibold">
                Excellent
              </span>

            </div>

            <div className="flex justify-between">

              <span>Order Delays</span>

              <span className="text-orange-500 font-semibold">
                Low
              </span>

            </div>

            <div className="flex justify-between">

              <span>Payment Recovery</span>

              <span className="text-green-600 font-semibold">
                Healthy
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Opportunity Insights */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Opportunity Insights
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="border rounded-lg p-5">

            <h3 className="font-semibold text-blue-600">
              New Leads
            </h3>

            <p className="text-3xl font-bold mt-3">
              124
            </p>

          </div>

          <div className="border rounded-lg p-5">

            <h3 className="font-semibold text-green-600">
              Upsell Chances
            </h3>

            <p className="text-3xl font-bold mt-3">
              39
            </p>

          </div>

          <div className="border rounded-lg p-5">

            <h3 className="font-semibold text-purple-600">
              Cross Sell
            </h3>

            <p className="text-3xl font-bold mt-3">
              56
            </p>

          </div>

          <div className="border rounded-lg p-5">

            <h3 className="font-semibold text-orange-600">
              Follow-ups
            </h3>

            <p className="text-3xl font-bold mt-3">
              78
            </p>

          </div>

        </div>

      </div>

      {/* AI Confidence Score */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          AI Confidence Score
        </h2>

        <div className="space-y-5">

          {[
            { title: "Revenue Prediction", score: 96 },
            { title: "Lead Recommendation", score: 93 },
            { title: "Customer Churn", score: 91 },
            { title: "Sales Forecast", score: 95 },
          ].map((item, index) => (

            <div key={index}>

              <div className="flex justify-between mb-2">

                <span>{item.title}</span>

                <span className="font-semibold">
                  {item.score}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                  className="bg-indigo-600 h-3 rounded-full"
                  style={{ width: `${item.score}%` }}
                ></div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Recent AI Activities */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent AI Activities
        </h2>

        <div className="space-y-4">

          {[
            "AI generated weekly revenue forecast.",
            "15 high-value leads identified.",
            "Customer churn alert generated for North Zone.",
            "Recommended territory reassignment.",
            "Detected sales growth opportunity in West Zone.",
            "Product D sales decline detected.",
          ].map((activity, index) => (

            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >

              <p>{activity}</p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}