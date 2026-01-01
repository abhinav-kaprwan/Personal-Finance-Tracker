import pool from "../config/db.js";
import redisClient from "../config/redis.js";

export const getSummary = async (req, res) => {
  try {
    console.log("getSummary called with userId:", req.user.userId, "role:", req.user.role);
    
    const { userId, role } = req.user;
    const cacheKey = `analytics:summary:${role}:${userId}`;

    // Try Redis cache with timeout
    if(redisClient){
      try {
        const cached = await Promise.race([
          redisClient.get(cacheKey),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
        ]);
        if (cached) {
          console.log("Returning cached summary");
          return res.json(JSON.parse(cached));
        }
      } catch (redisError) {
        console.error("Redis error (continuing without cache):", redisError.message);
      }
    }

    console.log("Querying database for summary...");

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

    console.log("Executing query:", query, "with values:", values);
    const result = await pool.query(query, values);
    console.log("Query result:", result.rows);

    const data = {
      income: Number(result.rows[0].income || 0),
      expense: Number(result.rows[0].expense || 0),
      balance:
        Number(result.rows[0].income || 0) -
        Number(result.rows[0].expense || 0)
    };

    // Cache in Redis with timeout
    if(redisClient){
      try {
        await Promise.race([
          redisClient.setEx(cacheKey, 900, JSON.stringify(data)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
        ]);
        console.log("Cached summary in Redis");
      } catch (redisError) {
        console.error("Redis cache error:", redisError.message);
      }
    }

    console.log("Returning data:", data);
    res.json(data);

  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    console.log("getCategoryBreakdown called with userId:", req.user.userId);
    
    const { userId, role } = req.user;
    const cacheKey = `analytics:category:${role}:${userId}`;

    // Try Redis cache with timeout
    if(redisClient){
      try {
        const cached = await Promise.race([
          redisClient.get(cacheKey),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
        ]);
        if (cached) {
          console.log("Returning cached category breakdown");
          return res.json({data: JSON.parse(cached)});
        }
      } catch (redisError) {
        console.error("Redis error (continuing without cache):", redisError.message);
      }
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

    console.log("Executing category query:", query);
    const result = await pool.query(query, values);
    console.log("Category query result:", result.rows);

    // Cache in Redis with timeout
    if(redisClient){
      try {
        await Promise.race([
          redisClient.setEx(cacheKey, 900, JSON.stringify(result.rows)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
        ]);
        console.log("Cached category breakdown in Redis");
      } catch (redisError) {
        console.error("Redis cache error:", redisError.message);
      }
    }

    res.json({data:result.rows});

  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    console.log("getMonthlyTrends called with userId:", req.user.userId);
    
    const { userId, role } = req.user;
    const cacheKey = `analytics:monthly:${role}:${userId}`;

    // Try Redis cache with timeout
    if(redisClient){
      try {
        const cached = await Promise.race([
          redisClient.get(cacheKey),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
        ]);
        if (cached) {
          console.log("Returning cached monthly trends");
          return res.json({data: JSON.parse(cached)});
        }
      } catch (redisError) {
        console.error("Redis error (continuing without cache):", redisError.message);
      }
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

    console.log("Executing monthly trends query:", query);
    const result = await pool.query(query, values);
    console.log("Monthly trends result:", result.rows);
    
    // Cache in Redis with timeout
    if(redisClient){
      try {
        await Promise.race([
          redisClient.setEx(cacheKey, 900, JSON.stringify(result.rows)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 2000))
        ]);
        console.log("Cached monthly trends in Redis");
      } catch (redisError) {
        console.error("Redis cache error:", redisError.message);
      }
    }
    
    res.json({data:result.rows});

  } catch (error) {
    console.error("Error fetching monthly trends:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

