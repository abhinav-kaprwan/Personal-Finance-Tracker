import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false
});

export default pool;
