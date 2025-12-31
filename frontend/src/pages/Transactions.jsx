import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";

const Transactions = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await api.get("/transactions");
    setTransactions(res.data.transactions);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/transactions", {
      type,
      amount,
      category_id: categoryId,
      date,
      notes
    });

    fetchTransactions();

    setAmount("");
    setCategoryId("");
    setDate("");
    setNotes("");
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Transactions</h2>

    {/* CREATE TRANSACTION */}
    {user?.role !== "read-only" && (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-6 space-y-4"
      >
        <div className="flex gap-4 flex-wrap">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            {categories
              .filter((c) => c.type === type)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Transaction
        </button>
      </form>
    )}

      {/* TRANSACTION LIST */}
      <h3>Transaction List</h3>
      {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
          ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
          ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">
                  Amount (₹)
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, index) => (
                <tr
                  key={t.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 text-sm">
                    {formatDate(t.date)}
                  </td>

                  <td className="px-4 py-2 text-sm capitalize">
                    {t.type}
                  </td>

                  <td className="px-4 py-2 text-sm">
                    {t.category_name}
                  </td>

                  <td
                    className={`px-4 py-2 text-sm text-right font-semibold ${
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
