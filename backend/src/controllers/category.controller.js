import pool from "../config/db.js";
import redisClient from "../config/redis.js";

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, type FROM categories ORDER BY name"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
