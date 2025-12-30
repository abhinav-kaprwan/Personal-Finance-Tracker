import dotenv from "dotenv";
import pool from "./config/db.js";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.query("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch(err => console.error(err));