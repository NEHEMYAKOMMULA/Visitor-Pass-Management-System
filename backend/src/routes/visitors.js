import express from "express";
import Visitor from "../models/Visitor.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js";
import { validateVisitDateTime } from "../utils/dateRules.js";
import { logActivity } from "../utils/activity.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const { visitorName, employeeName, visitDate, status } = req.query;
    const filter = {};
    if (visitorName) filter.visitorName = { $regex: visitorName, $options: "i" };
    if (visitDate) filter.visitDate = visitDate;
    if (status) filter.status = status;

    let visitors = await Visitor.find(filter)
      .populate("employee", "name email department")
      .populate("createdBy", "name role")
      .sort({ visitDate: -1, arrivalTime: -1 });

    if (employeeName) visitors = visitors.filter(v => v.employee?.name?.toLowerCase().includes(employeeName.toLowerCase()));

    if (req.user.role === "EMPLOYEE") {
      visitors = visitors.filter(v => String(v.employee?._id) === String(req.user._id));
    }

    res.json(visitors);
  } catch (e) { next(e); }
});

router.get("/:id", protect, async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate("employee", "name email department")
      .populate("createdBy", "name role");
    if (!visitor) return res.status(404).json({ message: "Visitor request not found" });
    if (req.user.role === "EMPLOYEE" && String(visitor.employee?._id) !== String(req.user._id))
      return res.status(403).json({ message: "Not your visitor request" });
    res.json(visitor);
  } catch (e) { next(e); }
});

router.post("/", protect, authorize("RECEPTIONIST", "ADMIN"), async (req, res, next) => {
  try {
    const { visitorName, visitorPhone, visitorEmail, company, employee, visitDate, arrivalTime, purpose, remarks } = req.body;
    if (!visitorName || !visitorPhone || !employee || !visitDate || !arrivalTime || !purpose)
      return res.status(400).json({ message: "Visitor name, phone, employee, date, arrival time and purpose are required" });

    const dateError = validateVisitDateTime(visitDate, arrivalTime);
    if (dateError) return res.status(400).json({ message: dateError });

    const employeeUser = await User.findOne({ _id: employee, role: "EMPLOYEE", active: true });
    if (!employeeUser) return res.status(400).json({ message: "Selected employee is invalid" });

    const duplicate = await Visitor.findOne({
      visitorPhone, visitDate, status: { $ne: "CANCELLED" }
    });
    if (duplicate) return res.status(409).json({ message: "Duplicate visitor registration for this visitor on the same date is not allowed" });

    const activeVisit = await Visitor.findOne({
      visitorPhone,
      status: { $in: ["APPROVED", "CHECKED_IN"] }
    });
    if (activeVisit) return res.status(409).json({ message: "Visitor already has an active visit" });

    const pendingCount = await Visitor.countDocuments({ employee, status: "PENDING" });
    if (pendingCount >= 3) return res.status(409).json({ message: "This employee already has 3 pending visitor requests" });

    const visitor = await Visitor.create({
      visitorName, visitorPhone, visitorEmail, company, employee, visitDate, arrivalTime, purpose, remarks,
      createdBy: req.user._id, status: "PENDING"
    });

    await logActivity(visitor._id, "Created", req.user._id, "Visitor request created");
    res.status(201).json(await visitor.populate("employee", "name email department"));
  } catch (e) { next(e); }
});

router.put("/:id/approve", protect, authorize("EMPLOYEE"), async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    if (String(visitor.employee) !== String(req.user._id)) return res.status(403).json({ message: "Not your visitor request" });
    if (visitor.status !== "PENDING") return res.status(400).json({ message: "Only pending requests can be approved" });

    visitor.status = "APPROVED";
    visitor.remarks = req.body.remarks ?? visitor.remarks;
    await visitor.save();
    await logActivity(visitor._id, "Approved", req.user._id, visitor.remarks || "");
    res.json(visitor);
  } catch (e) { next(e); }
});

router.put("/:id/reject", protect, authorize("EMPLOYEE"), async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    if (String(visitor.employee) !== String(req.user._id)) return res.status(403).json({ message: "Not your visitor request" });
    if (visitor.status !== "PENDING") return res.status(400).json({ message: "Only pending requests can be rejected" });

    visitor.status = "REJECTED";
    visitor.remarks = req.body.remarks || visitor.remarks;
    await visitor.save();
    await logActivity(visitor._id, "Rejected", req.user._id, visitor.remarks || "");
    res.json(visitor);
  } catch (e) { next(e); }
});

router.put("/:id/check-in", protect, authorize("RECEPTIONIST", "ADMIN"), async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    if (visitor.status === "REJECTED") return res.status(400).json({ message: "Rejected visitor requests cannot be checked in" });
    if (visitor.status === "CHECKED_IN") return res.status(400).json({ message: "Visitor is already checked in" });
    if (visitor.status !== "APPROVED") return res.status(400).json({ message: "Visitor can only be checked in after approval" });

    visitor.status = "CHECKED_IN";
    visitor.checkInTime = new Date();
    await visitor.save();
    await logActivity(visitor._id, "Checked In", req.user._id);
    res.json(visitor);
  } catch (e) { next(e); }
});

router.put("/:id/check-out", protect, authorize("RECEPTIONIST", "ADMIN"), async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    if (visitor.status !== "CHECKED_IN" || !visitor.checkInTime) return res.status(400).json({ message: "Visitor must be checked in before checkout" });

    const requestedTime = req.body.checkOutTime ? new Date(req.body.checkOutTime) : new Date();
    if (Number.isNaN(requestedTime.getTime()) || requestedTime <= visitor.checkInTime)
      return res.status(400).json({ message: "Check-out time must be later than check-in time" });

    visitor.status = "CHECKED_OUT";
    visitor.checkOutTime = requestedTime;
    await visitor.save();
    await logActivity(visitor._id, "Checked Out", req.user._id);
    res.json(visitor);
  } catch (e) { next(e); }
});

router.put("/:id/cancel", protect, authorize("RECEPTIONIST", "ADMIN"), async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    if (["CHECKED_IN", "CHECKED_OUT"].includes(visitor.status)) return res.status(400).json({ message: "This visit cannot be cancelled" });

    visitor.status = "CANCELLED";
    await visitor.save();
    await logActivity(visitor._id, "Cancelled", req.user._id);
    res.json(visitor);
  } catch (e) { next(e); }
});

export default router;
