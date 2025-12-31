import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const Transactions = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

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
    const res = await api.get("/transactions");
    setTransactions(res.data.transactions);
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
    <div>
      <h2>Transactions</h2>

      {/* CREATE TRANSACTION (hidden for read-only) */}
      {user?.role !== "read-only" && (
        <form onSubmit={handleSubmit}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
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
          />

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit">Add Transaction</button>
        </form>
      )}

      {/* TRANSACTION LIST */}
      <h3>Transaction List</h3>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.date} | {t.type} | {t.amount} | {t.category_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
