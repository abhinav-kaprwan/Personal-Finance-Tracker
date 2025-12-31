import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getCategories } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", authenticate, getCategories);

export default router;
