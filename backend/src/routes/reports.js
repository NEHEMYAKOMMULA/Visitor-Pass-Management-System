import express from "express";
import Visitor from "../models/Visitor.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), async (req, res, next) => {
  try {
    const now = new Date();
    const from = req.query.from || now.toISOString().slice(0, 10);
    const to = req.query.to || from;
    const rows = await Visitor.find({ visitDate: { $gte: from, $lte: to } })
      .populate("employee", "name department")
      .sort({ visitDate: -1, arrivalTime: -1 });

    const stats = {
      total: rows.length,
      pending: rows.filter(x => x.status === "PENDING").length,
      approved: rows.filter(x => x.status === "APPROVED").length,
      rejected: rows.filter(x => x.status === "REJECTED").length,
      checkedIn: rows.filter(x => x.status === "CHECKED_IN").length,
      checkedOut: rows.filter(x => x.status === "CHECKED_OUT").length,
      cancelled: rows.filter(x => x.status === "CANCELLED").length
    };
    res.json({ stats, rows });
  } catch (e) { next(e); }
});

export default router;
