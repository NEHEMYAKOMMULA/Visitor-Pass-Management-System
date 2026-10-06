import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import visitorRoutes from "./routes/visitors.js";
import employeeRoutes from "./routes/employees.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "./routes/reports.js";
import activityRoutes from "./routes/activity.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, message: "Visitor Pass API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity", activityRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

export default app;
