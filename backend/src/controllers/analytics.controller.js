import pool from "../config/db.js";

export const getSummary = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let query;
    let values = [];

    if (role === "admin") {
      query = `
        SELECT
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
        FROM transactions
      `;
    } else {
      query = `
        SELECT
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
        FROM transactions
        WHERE user_id = $1
      `;
      values = [userId];
    }

    const result = await pool.query(query, values);

    const income = Number(result.rows[0].income || 0);
    const expense = Number(result.rows[0].expense || 0);

    res.json({
      income,
      expense,
      balance: income - expense
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let query;
    let values = [];

    if (role === "admin") {
      query = `
        SELECT c.name, SUM(t.amount) AS total
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.type = 'expense'
        GROUP BY c.name
      `;
    } else {
      query = `
        SELECT c.name, SUM(t.amount) AS total
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.type = 'expense' AND t.user_id = $1
        GROUP BY c.name
      `;
      values = [userId];
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const { userId, role } = req.user;

    let query;
    let values = [];

    if (role === "admin") {
      query = `
        SELECT
          TO_CHAR(date, 'YYYY-MM') AS month,
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
        FROM transactions
        GROUP BY month
        ORDER BY month
      `;
    } else {
      query = `
        SELECT
          TO_CHAR(date, 'YYYY-MM') AS month,
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
        FROM transactions
        WHERE user_id = $1
        GROUP BY month
        ORDER BY month
      `;
      values = [userId];
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

