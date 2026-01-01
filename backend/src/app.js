import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import categoryRoutes from "./routes/category.routes.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://personal-finance-tracker-abhinav-kaprwans-projects.vercel.app"
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if the origin ends with vercel.app (for preview deployments)
      if (origin.includes("vercel.app") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/health", async (req, res) => {
  try {
    const { default: pool } = await import("./config/db.js");
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoryRoutes);

export default app;