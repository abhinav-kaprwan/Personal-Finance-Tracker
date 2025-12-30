import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createTransaction,
  getTransactions
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

export default router;
