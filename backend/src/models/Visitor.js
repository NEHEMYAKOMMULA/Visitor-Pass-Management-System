import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  visitorName: { type: String, required: true, trim: true },
  visitorPhone: { type: String, required: true, trim: true },
  visitorEmail: { type: String, default: "", trim: true },
  company: { type: String, default: "", trim: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visitDate: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  purpose: { type: String, required: true, trim: true },
  remarks: { type: String, default: "" },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"],
    default: "PENDING"
  },
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

visitorSchema.index({ visitorPhone: 1, visitDate: 1 });
visitorSchema.index({ employee: 1, status: 1, visitDate: 1 });

export default mongoose.model("Visitor", visitorSchema);
