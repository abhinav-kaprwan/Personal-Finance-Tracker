import pool from "../config/db.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category_id, date, notes } = req.body;
    const userId = req.user.userId;

    if (!type || !amount || !category_id || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO transactions 
       (user_id, type, amount, category_id, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, type, amount, category_id, date, notes]
    );

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { role, userId } = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query;
    let values;

    if (role === "admin") {
      query = `
        SELECT t.*, c.name AS category_name
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        ORDER BY t.date DESC
        LIMIT $1 OFFSET $2
      `;
      values = [limit, offset];
    } else {
      query = `
        SELECT t.*, c.name AS category_name
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = $1
        ORDER BY t.date DESC
        LIMIT $2 OFFSET $3
      `;
      values = [userId, limit, offset];
    }

    const result = await pool.query(query, values);

    res.json({
      page,
      limit,
      transactions: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category_id, date, notes } = req.body;
    const { userId, role } = req.user;

    const existing = await pool.query(
      "SELECT user_id FROM transactions WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (role !== "admin" && existing.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const result = await pool.query(
      `UPDATE transactions
       SET type=$1, amount=$2, category_id=$3, date=$4, notes=$5, updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [type, amount, category_id, date, notes, id]
    );

    res.json({
      message: "Transaction updated successfully",
      transaction: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const existing = await pool.query(
      "SELECT user_id FROM transactions WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (role !== "admin" && existing.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await pool.query(
      "DELETE FROM transactions WHERE id = $1",
      [id]
    );

    res.json({ message: "Transaction deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

