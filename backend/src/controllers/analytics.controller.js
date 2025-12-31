import pool from "../config/db.js";
import redisClient from "../config/redis.js";

export const getSummary = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const cacheKey = `summary:${role}:${userId}`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

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

    const data = {
      income: Number(result.rows[0].income || 0),
      expense: Number(result.rows[0].expense || 0),
      balance:
        Number(result.rows[0].income || 0) -
        Number(result.rows[0].expense || 0)
    };

    await redisClient.setEx(cacheKey, 900, JSON.stringify(data));

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const cacheKey = `analytics:category:${role}:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

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

    await redisClient.setEx(
      cacheKey,
      900,
      JSON.stringify(result.rows)
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const cacheKey = `analytics:monthly:${role}:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

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
    
    await redisClient.setEx(
      cacheKey,
      900,
      JSON.stringify(result.rows)
    );
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

