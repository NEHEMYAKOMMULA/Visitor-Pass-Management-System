import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

await mongoose.connect(process.env.MONGO_URI);

const users = [
  { name: "System Administrator", email: "admin@visitorpass.com", password: "Admin@123", role: "ADMIN", department: "Administration" },
  { name: "Front Desk Receptionist", email: "receptionist@visitorpass.com", password: "Reception@123", role: "RECEPTIONIST", department: "Front Office" },
  { name: "Demo Employee", email: "employee@visitorpass.com", password: "Employee@123", role: "EMPLOYEE", department: "Engineering" }
];

for (const u of users) {
  const password = await bcrypt.hash(u.password, 10);
  await User.findOneAndUpdate(
    { email: u.email },
    { ...u, password },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

console.log("Demo users created/updated.");
await mongoose.disconnect();
