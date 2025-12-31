import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, Tooltip, Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchCategory();
    fetchMonthly();
  }, []);

  const fetchSummary = async () => {
    const res = await api.get("/analytics/summary");
    setSummary(res.data);
  };

  const fetchCategory = async () => {
    const res = await api.get("/analytics/category");
    console.log("CATEGORY DATA:", res.data);
    setCategoryData(
    res.data.map(item => ({
      ...item,
      total: Number(item.total)
    }))
    );
  };

  const fetchMonthly = async () => {
    const res = await api.get("/analytics/monthly");
    setMonthlyData(res.data);
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      {summary && (
        <div>
          <p>Income: {summary.income}</p>
          <p>Expense: {summary.expense}</p>
          <p>Balance: {summary.balance}</p>
        </div>
      )}

      <h3>Category-wise Expense</h3>
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
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>Monthly Income vs Expense</h3>
      <LineChart width={500} height={300} data={monthlyData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#82ca9d" />
        <Line type="monotone" dataKey="expense" stroke="#ff7300" />
      </LineChart>
    </div>
  );
};

export default Analytics;
