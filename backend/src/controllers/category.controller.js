import pool from "../config/db.js";
import redisClient from "../config/redis.js";

export const getCategories = async (req, res) => {
  try {
    const cacheKey = "categories:all";

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      "SELECT id, name, type FROM categories ORDER BY name"
    );

    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify(result.rows)
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
