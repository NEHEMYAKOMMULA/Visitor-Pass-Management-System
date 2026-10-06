import Activity from "../models/Activity.js";

export async function logActivity(visitorId, action, userId, details = "") {
  return Activity.create({ visitor: visitorId, action, performedBy: userId, details });
}
