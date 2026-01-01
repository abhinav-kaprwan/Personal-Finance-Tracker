import pool from "../config/db.js";
import redisClient from "../config/redis.js";

export const getCategories = async (req, res) => {
  try {
    const cacheKey = "categories:all";

    if(redisClient){
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (err) {
        console.warn("Redis GET failed, skipping cache");
      }
    }

    const result = await pool.query(
      "SELECT id, name, type FROM categories ORDER BY name"
    );

    if(redisClient){
      redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify(result.rows)
    ).catch(() => {});;
    }

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
