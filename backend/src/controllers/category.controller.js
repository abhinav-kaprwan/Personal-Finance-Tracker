import pool from "../config/db.js";

export const getCategories = async (req, res) => {
  try {
    console.log("Fetching categories...");
    const result = await pool.query(
      "SELECT id, name, type FROM categories ORDER BY name"
    );

    console.log("Categories found:", result.rows.length);
    return res.json(result.rows);

  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
