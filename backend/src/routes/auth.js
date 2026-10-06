import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user || !user.active || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (e) { next(e); }
});

router.get("/me", protect, async (req, res) => res.json({ user: req.user }));

export default router;
