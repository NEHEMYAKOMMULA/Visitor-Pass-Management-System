import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { next(e); }
});

router.post("/", protect, authorize("ADMIN"), async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: "Name, email, password and role are required" });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already exists" });
    const user = await User.create({
      name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), role, department
    });
    res.status(201).json({ id: user._id, message: "User created" });
  } catch (e) { next(e); }
});

router.put("/:id", protect, authorize("ADMIN"), async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (update.password) update.password = await bcrypt.hash(update.password, 10);
    delete update._id;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
});

router.delete("/:id", protect, authorize("ADMIN"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deactivated" });
  } catch (e) { next(e); }
});

export default router;
