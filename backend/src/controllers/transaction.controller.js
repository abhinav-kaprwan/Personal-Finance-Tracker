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
