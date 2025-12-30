import express from "express";
import { register,login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login",login);

router.get(
  "/rbac-test",
  authenticate,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
export default router;
