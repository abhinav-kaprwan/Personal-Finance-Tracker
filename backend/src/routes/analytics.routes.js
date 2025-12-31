import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { analyticsLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends
} from "../controllers/analytics.controller.js";

const router = express.Router();
router.use(analyticsLimiter);

router.get("/summary", authenticate, getSummary);
router.get("/category", authenticate, getCategoryBreakdown);
router.get("/monthly", authenticate, getMonthlyTrends);

export default router;
