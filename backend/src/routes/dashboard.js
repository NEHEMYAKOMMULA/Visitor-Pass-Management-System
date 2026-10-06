import express from "express";
import Visitor from "../models/Visitor.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const base = req.user.role === "EMPLOYEE" ? { employee: req.user._id } : {};
    const [pending, todayVisitors, inside, totalEmployees, scheduled] = await Promise.all([
      Visitor.countDocuments({ ...base, status: "PENDING" }),
      Visitor.countDocuments({ ...base, visitDate: today, status: { $ne: "CANCELLED" } }),
      Visitor.countDocuments({ ...base, status: "CHECKED_IN" }),
      User.countDocuments({ role: "EMPLOYEE", active: true }),
      Visitor.countDocuments({ ...base, visitDate: today, status: "APPROVED" })
    ]);
    res.json({ pending, todayVisitors, inside, totalEmployees, scheduled });
  } catch (e) { next(e); }
});

export default router;
