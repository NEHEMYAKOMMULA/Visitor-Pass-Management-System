import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE", active: true }).select("_id name email department").sort({ name: 1 });
    res.json(employees);
  } catch (e) { next(e); }
});

export default router;
