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
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const limit = 10;
  useEffect(() => {
    fetchCategories();
    fetchTransactions(page);
  }, [page]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const fetchTransactions = async (pageNumber = 1) => {
    setLoading(true);
    const res = await api.get(`/transactions?page=${pageNumber}&limit=${limit}`);
    setTransactions(res.data.transactions);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type,
      amount,
      category_id: categoryId,
      date,
      notes
    };

    if (editingId) {
      await api.put(`/transactions/${editingId}`, payload);
    } else {
      await api.post("/transactions", payload);
    }

    setEditingId(null);
    setPage(1);
    fetchTransactions(1);

    setAmount("");
    setCategoryId("");
    setDate("");
    setNotes("");
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setType(transaction.type);
    setAmount(transaction.amount);
    setCategoryId(transaction.category_id);
    setDate(transaction.date.split("T")[0]);
    setNotes(transaction.notes || "");
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this transaction?");
    if (!confirm) return;

    await api.delete(`/transactions/${id}`);
    fetchTransactions();
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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>
    )}

      {/* TRANSACTION LIST ----*/}
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
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                  Action
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
                  <td className="px-4 py-2 text-center">
                    {user?.role !== "read-only" && (
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className={`px-4 py-2 rounded ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page}
            </span>

            <button
              disabled={transactions.length < limit}
              onClick={() => setPage(prev => prev + 1)}
              className={`px-4 py-2 rounded ${
                transactions.length < limit
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
