import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        const summaryRes = await api.get("/analytics/summary");
        const categoryRes = await api.get("/analytics/category");
        const monthlyRes = await api.get("/analytics/monthly");

        setSummary(summaryRes.data);
        
         console.log(categoryRes.data);
        setCategoryData(
          categoryRes.data.data.map(item => ({
            ...item,
            total: Number(item.total)
          }))
        );
        console.log("monthlyRes:", monthlyRes.data);
        setMonthlyData(
          monthlyRes.data.data.map(item => ({
            ...item,
            income: Number(item.income),
            expense: Number(item.expense)
          }))
        );
      } catch (err) {
        console.error("Analytics fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return (
  <Layout>
    <h2 className="text-2xl font-bold mb-6">Analytics</h2>

    {loading ? (
      <p className="text-gray-500">Loading analytics...</p>
    ) : (
      <>
        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Income</p>
              <p className="text-2xl font-bold text-green-600">
                ₹ {summary.income}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Expense</p>
              <p className="text-2xl font-bold text-red-600">
                ₹ {summary.expense}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Balance</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹ {summary.balance}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CATEGORY PIE CHART */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Category-wise Expense
            </h3>

            {categoryData.length === 0 ? (
              <p className="text-gray-500">No expense data available</p>
            ) : (
              <PieChart width={400} height={300}>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </div>

          {/* MONTHLY LINE CHART */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Monthly Income vs Expense
            </h3>

            {monthlyData.length === 0 ? (
              <p className="text-gray-500">No monthly data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

            )}
          </div>
        </div>
        
      </>
    )}
  </Layout>
);
};

export default Analytics;
