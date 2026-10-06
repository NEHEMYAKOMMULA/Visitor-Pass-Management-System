import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  details: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
