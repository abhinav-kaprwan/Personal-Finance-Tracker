import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getTransactions
);

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "user"),
  createTransaction
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "user"),
  updateTransaction
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "user"),
  deleteTransaction
);

export default router;
