import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;