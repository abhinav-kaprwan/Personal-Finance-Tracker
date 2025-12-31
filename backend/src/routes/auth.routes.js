import express from "express";
import { register,login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
const router = express.Router();
// auth login and register routes
router.post("/register",authLimiter, register);
router.post("/login",authLimiter,login);

router.get(
  "/rbac-test",
  authenticate,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
export default router;
