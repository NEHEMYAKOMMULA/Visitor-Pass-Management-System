import express from "express";
import Activity from "../models/Activity.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), async (req, res, next) => {
  try {
    const rows = await Activity.find()
      .populate("visitor", "visitorName visitDate status")
      .populate("performedBy", "name role")
      .sort({ createdAt: -1 })
      .limit(300);
    res.json(rows);
  } catch (e) { next(e); }
});

export default router;
