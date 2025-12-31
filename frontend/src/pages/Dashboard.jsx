import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const res = await api.get("/analytics/summary");
    setSummary(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default Dashboard;
