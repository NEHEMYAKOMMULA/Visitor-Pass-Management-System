import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users as UsersIcon,
  UserPlus,
  ClipboardList,
  BarChart3,
  Activity as ActivityIcon,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Clock,
  UserCheck,
  CalendarDays,
  Search,
  RefreshCw,
  XCircle,
  LogIn,
  LogOut as LogOutIcon,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import api from "./api";
import "./styles.css";

/* =========================================================
   AUTH HELPERS
========================================================= */

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function isLoggedIn() {
  return Boolean(getToken() && getUser());
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children, roles }) {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <ShieldCheck size={42} />
        </div>

        <h1>Visitor Pass Management</h1>

        <p className="login-subtitle">
          Secure Visitor Management System
        </p>

        {/* Error */}
        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn primary full-width"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* Demo Accounts */}
        <div className="demo-login">

          <h3>Demo Accounts</h3>

          <p className="demo-subtitle">
            Select an account to quickly test each role
          </p>

          <div className="demo-accounts">

            {/* ADMIN */}
            <div className="demo-account admin-card">

              <div className="demo-account-icon">
                <ShieldCheck size={24} />
              </div>

              <h4>Administrator</h4>

              <span className="demo-role">
                Full Access
              </span>

              <p>
                admin@visitorpass.com
              </p>

              <p className="demo-password">
                Password: Admin@123
              </p>

              <button
                type="button"
                className="demo-use-btn"
                onClick={() => {
                  setEmail(
                    "admin@visitorpass.com"
                  );

                  setPassword("Admin@123");

                  setError("");
                }}
              >
                Use Admin
              </button>

            </div>


            {/* RECEPTIONIST */}
            <div className="demo-account receptionist-card">

              <div className="demo-account-icon">
                <UserPlus size={24} />
              </div>

              <h4>Receptionist</h4>

              <span className="demo-role">
                Front Desk
              </span>

              <p>
                receptionist@visitorpass.com
              </p>

              <p className="demo-password">
                Password: Reception@123
              </p>

              <button
                type="button"
                className="demo-use-btn"
                onClick={() => {
                  setEmail(
                    "receptionist@visitorpass.com"
                  );

                  setPassword("Reception@123");

                  setError("");
                }}
              >
                Use Receptionist
              </button>

            </div>


            {/* EMPLOYEE */}
            <div className="demo-account employee-card">

              <div className="demo-account-icon">
                <UsersIcon size={24} />
              </div>

              <h4>Employee</h4>

              <span className="demo-role">
                Approval Access
              </span>

              <p>
                employee@visitorpass.com
              </p>

              <p className="demo-password">
                Password: Employee@123
              </p>

              <button
                type="button"
                className="demo-use-btn"
                onClick={() => {
                  setEmail(
                    "employee@visitorpass.com"
                  );

                  setPassword("Employee@123");

                  setError("");
                }}
              >
                Use Employee
              </button>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
/* =========================================================
   LAYOUT
========================================================= */

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getUser();

  const [mobileMenu, setMobileMenu] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: [
        "ADMIN",
        "RECEPTIONIST",
        "EMPLOYEE",
      ],
    },

    {
      path: "/visitors",
      label: "Visitors",
      icon: ClipboardList,
      roles: [
        "ADMIN",
        "RECEPTIONIST",
        "EMPLOYEE",
      ],
    },

    {
      path: "/register-visitor",
      label: "Register Visitor",
      icon: UserPlus,
      roles: [
        "ADMIN",
        "RECEPTIONIST",
      ],
    },

    {
      path: "/users",
      label: "User Management",
      icon: UsersIcon,
      roles: ["ADMIN"],
    },

    {
      path: "/reports",
      label: "Reports",
      icon: BarChart3,
      roles: ["ADMIN"],
    },

    {
      path: "/activity",
      label: "Activity History",
      icon: ActivityIcon,
      roles: ["ADMIN"],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <div className="app-layout">
      <aside
        className={
          mobileMenu
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="sidebar-header">
          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h2>VisitorPass</h2>
            <span>Management System</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(
                item.path + "/"
              );

            return (
              <Link
                key={item.path}
                to={item.path}
                className={
                  active
                    ? "nav-link active"
                    : "nav-link"
                }
                onClick={() =>
                  setMobileMenu(false)
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role || ""}
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={24} />
          </button>

          <div>
            <h3>
              Visitor Pass Management
            </h3>
          </div>

          <div className="topbar-user">
            <span>{user?.name}</span>

            <span className="role-badge">
              {user?.role}
            </span>
          </div>
        </header>

        <section className="page-content">
          {children}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   COMMON COMPONENTS
========================================================= */

function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

function Status({ value }) {
  const status = String(value || "");

  const statusClass =
    "status " + status.toLowerCase();

  const statusText = status.replaceAll(
    "_",
    " "
  );

  return (
    <span className={statusClass}>
      {statusText}
    </span>
  );
}

function Loading() {
  return (
    <div className="loading">
      Loading...
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
}) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={45} />}

      <h3>{title}</h3>

      {message && <p>{message}</p>}
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const user = getUser();

  const [stats, setStats] = useState({
    pendingRequests: 0,
    todayVisitors: 0,
    currentlyInside: 0,
    totalEmployees: 0,
    scheduledVisitors: 0,
  });

  const [loading, setLoading] =
    useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response =
        await api.get("/dashboard");

      setStats({
        pendingRequests:
          response.data.pendingRequests || 0,

        todayVisitors:
          response.data.todayVisitors || 0,

        currentlyInside:
          response.data.currentlyInside || 0,

        totalEmployees:
          response.data.totalEmployees || 0,

        scheduledVisitors:
          response.data.scheduledVisitors || 0,
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
    },

    {
      title: "Today's Visitors",
      value: stats.todayVisitors,
      icon: CalendarDays,
    },

    {
      title: "Currently Inside",
      value: stats.currentlyInside,
      icon: UserCheck,
    },

    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: UsersIcon,
    },

    {
      title: "Scheduled Visitors",
      value: stats.scheduledVisitors,
      icon: ClipboardList,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={
          "Welcome back, " +
          (user?.name || "User")
        }
        action={
          <button
            className="btn secondary"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <div className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="stat-card"
              key={card.title}
            >
              <div className="stat-icon">
                <Icon size={25} />
              </div>

              <div>
                <p>{card.title}</p>

                <h2>
                  {loading
                    ? "..."
                    : card.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-info">
  <div className="info-card">
    <CheckCircle size={30} />

    <div className="workflow-container">
      <h3>Visitor Workflow</h3>

      <div className="workflow">
        <div className="workflow-step">
          <div className="workflow-number">1</div>

          <div>
            <strong>Register</strong>
            <span>Receptionist registers visitor</span>
          </div>
        </div>

        <div className="workflow-arrow">→</div>

        <div className="workflow-step">
          <div className="workflow-number">2</div>

          <div>
            <strong>Approve</strong>
            <span>Employee approves or rejects</span>
          </div>
        </div>

        <div className="workflow-arrow">→</div>

        <div className="workflow-step">
          <div className="workflow-number">3</div>

          <div>
            <strong>Check In</strong>
            <span>Receptionist checks in visitor</span>
          </div>
        </div>

        <div className="workflow-arrow">→</div>

        <div className="workflow-step">
          <div className="workflow-number">4</div>

          <div>
            <strong>Check Out</strong>
            <span>Visitor checks out</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  );
}

/* =========================================================
   VISITORS
========================================================= */

function Visitors() {
  const user = getUser();

  const [visitors, setVisitors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [visitDate, setVisitDate] =
    useState("");

  const [selectedVisitor, setSelectedVisitor] =
    useState(null);

  async function loadVisitors(
    customParams = null
  ) {
    try {
      setLoading(true);

      const params =
        customParams || {};

      if (!customParams) {
        if (search.trim()) {
          params.search =
            search.trim();
        }

        if (status) {
          params.status = status;
        }

        if (visitDate) {
          params.visitDate =
            visitDate;
        }
      }

      const response =
        await api.get("/visitors", {
          params,
        });

      setVisitors(
        Array.isArray(response.data)
          ? response.data
          : response.data.visitors ||
              []
      );
    } catch (error) {
      console.error(
        "Visitor loading error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to load visitors."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisitors();
  }, []);

  async function updateVisitor(
  id,
  action,
  body = {}
) {
  try {
    const response = await api.put(
      `/visitors/${id}/${action}`,
      body
    );

    console.log("Visitor updated:", response.data);

    alert("Visitor status updated successfully.");

    setSelectedVisitor(null);

    await loadVisitors();

  } catch (error) {
    console.error("Visitor update error:", error);
    console.error(
      "Backend response:",
      error?.response?.data
    );

    alert(
      error?.response?.data?.message ||
        "Unable to update visitor."
    );
  }
}

  function handleSearch(event) {
    event.preventDefault();

    loadVisitors();
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setVisitDate("");

    loadVisitors({});
  }

  return (
    <>
      <PageHeader
        title="Visitor Management"
        description={
          user?.role === "EMPLOYEE"
            ? "Review visitor requests assigned to you"
            : "Search, check-in and check-out visitors"
        }
      />

      <div className="filter-card">
        <form
          className="search-form"
          onSubmit={handleSearch}
        >
          <div className="search-input">
            <Search size={18} />

            <input
              type="text"
              placeholder="Visitor or employee name"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <input
            type="date"
            value={visitDate}
            onChange={(event) =>
              setVisitDate(
                event.target.value
              )
            }
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="CHECKED_IN">
              Checked In
            </option>

            <option value="CHECKED_OUT">
              Checked Out
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <button
            type="submit"
            className="btn primary"
          >
            <Search size={16} />
            Search
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={clearFilters}
          >
            Clear
          </button>
        </form>
      </div>

      <div className="table-card">
        {loading ? (
          <Loading />
        ) : visitors.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No visitors found"
            message="No visitor records match the selected filters."
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Phone</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Arrival</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map(
                  (visitor) => (
                    <tr
                      key={visitor._id}
                    >
                      <td>
                        <strong>
                          {
                            visitor.visitorName
                          }
                        </strong>
                      </td>

                      <td>
                        {visitor.phone}
                      </td>

                      <td>
                        {
                          visitor.employee
                            ?.name
                        }

                        {!visitor.employee
                          ?.name &&
                          (visitor.employeeName ||
                            "-")}
                      </td>

                      <td>
                        {
                          visitor.visitDate
                        }
                      </td>

                      <td>
                        {
                          visitor.arrivalTime
                        }
                      </td>

                      <td>
                        {visitor.purpose}
                      </td>

                      <td>
                        <Status
                          value={
                            visitor.status
                          }
                        />
                      </td>

                      <td>
                        <VisitorActions
                          visitor={
                            visitor
                          }
                          user={user}
                          onAction={
                            updateVisitor
                          }
                          onView={() =>
                            setSelectedVisitor(
                              visitor
                            )
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedVisitor && (
        <VisitorDetails
          visitor={selectedVisitor}
          onClose={() =>
            setSelectedVisitor(null)
          }
        />
      )}
    </>
  );
}

/* =========================================================
   VISITOR ACTIONS
========================================================= */

function VisitorActions({
  visitor,
  user,
  onAction,
  onView,
}) {
  return (
    <div className="action-buttons">
      <button
        className="btn secondary small"
        onClick={onView}
      >
        View
      </button>

      {user?.role === "EMPLOYEE" &&
        visitor.status ===
          "PENDING" && (
          <>
            <button
              className="btn success small"
              onClick={() =>
                onAction(
                  visitor._id,
                  "approve"
                )
              }
            >
              <CheckCircle size={14} />
              Approve
            </button>

            <button
              className="btn danger small"
              onClick={() =>
                onAction(
                  visitor._id,
                  "reject"
                )
              }
            >
              <XCircle size={14} />
              Reject
            </button>
          </>
        )}

      {(user?.role ===
        "RECEPTIONIST" ||
        user?.role === "ADMIN") &&
        visitor.status ===
          "APPROVED" && (
          <button
            className="btn primary small"
            onClick={() =>
              onAction(
                visitor._id,
                "check-in"
              )
            }
          >
            <LogIn size={14} />
            Check In
          </button>
        )}

      {(user?.role ===
        "RECEPTIONIST" ||
        user?.role === "ADMIN") &&
        visitor.status ===
          "CHECKED_IN" && (
          <button
            className="btn warning small"
            onClick={() =>
              onAction(
                visitor._id,
                "check-out"
              )
            }
          >
            <LogOutIcon size={14} />
            Check Out
          </button>
        )}

      {(user?.role ===
        "RECEPTIONIST" ||
        user?.role === "ADMIN") &&
        (visitor.status ===
          "PENDING" ||
          visitor.status ===
            "APPROVED") && (
          <button
            className="btn danger small"
            onClick={() =>
              onAction(
                visitor._id,
                "cancel"
              )
            }
          >
            Cancel
          </button>
        )}
    </div>
  );
}

/* =========================================================
   VISITOR DETAILS
========================================================= */

function VisitorDetails({
  visitor,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Visitor Details</h2>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="details-grid">
          <Detail
            label="Visitor Name"
            value={
              visitor.visitorName
            }
          />

          <Detail
            label="Phone"
            value={
              visitor.phone
            }
          />

          <Detail
            label="Email"
            value={
              visitor.email || "-"
            }
          />

          <Detail
            label="Employee"
            value={
              visitor.employee
                ?.name ||
              visitor.employeeName ||
              "-"
            }
          />

          <Detail
            label="Visit Date"
            value={
              visitor.visitDate
            }
          />

          <Detail
            label="Arrival Time"
            value={
              visitor.arrivalTime
            }
          />

          <Detail
            label="Purpose"
            value={
              visitor.purpose
            }
          />

          <Detail
            label="Status"
            value={
              <Status
                value={
                  visitor.status
                }
              />
            }
          />

          <Detail
            label="Remarks"
            value={
              visitor.remarks || "-"
            }
          />

          <Detail
            label="Check In"
            value={
              visitor.checkInTime ||
              "-"
            }
          />

          <Detail
            label="Check Out"
            value={
              visitor.checkOutTime ||
              "-"
            }
          />
        </div>

        <div className="modal-footer">
          <button
            className="btn secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   REGISTER VISITOR
========================================================= */

function RegisterVisitor() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    visitorName: "",
    visitorPhone: "",
    visitorEmail: "",
    company: "",
    employee: "",
    visitDate: "",
    arrivalTime: "",
    purpose: "",
    remarks: "",
  });

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Load employees
  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await api.get("/employees");

        console.log("Employees:", response.data);

        const employeeList = Array.isArray(response.data)
          ? response.data
          : response.data.employees || [];

        setEmployees(employeeList);

        if (employeeList.length === 0) {
          setError(
            "No active employees found. Please create an Employee account."
          );
        }
      } catch (error) {
        console.error("Employee loading error:", error);

        setError(
          error?.response?.data?.message ||
            "Unable to load employees."
        );
      }
    }

    loadEmployees();
  }, []);

  // Handle form changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // Submit visitor
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!form.visitorName.trim()) {
      setError("Visitor name is required.");
      return;
    }

    if (!form.visitorPhone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!form.employee) {
      setError("Please select an employee.");
      return;
    }

    if (!form.visitDate) {
      setError("Visit date is required.");
      return;
    }

    if (!form.arrivalTime) {
      setError("Arrival time is required.");
      return;
    }

    if (!form.purpose.trim()) {
      setError("Purpose is required.");
      return;
    }

    // Date cannot be before today
    if (form.visitDate < today) {
      setError("Visit date cannot be before today.");
      return;
    }

    setLoading(true);

    try {
      // Send exactly the field names expected by backend
      const payload = {
        visitorName: form.visitorName.trim(),
        visitorPhone: form.visitorPhone.trim(),
        visitorEmail: form.visitorEmail.trim(),
        company: form.company.trim(),
        employee: form.employee,
        visitDate: form.visitDate,
        arrivalTime: form.arrivalTime,
        purpose: form.purpose.trim(),
        remarks: form.remarks.trim(),
      };

      console.log("Submitting visitor:", payload);

      await api.post("/visitors", payload);

      setSuccess("Visitor request created successfully.");

      // Clear form
      setForm({
        visitorName: "",
        visitorPhone: "",
        visitorEmail: "",
        company: "",
        employee: "",
        visitDate: "",
        arrivalTime: "",
        purpose: "",
        remarks: "",
      });

      // Go to visitors page after short delay
      setTimeout(() => {
        navigate("/visitors");
      }, 1000);
    } catch (error) {
      console.error("Visitor registration error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to register visitor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Register Visitor"
        description="Create a visitor request for an employee"
      />

      <div className="form-card">

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Visitor Name */}
            <div className="form-group">
              <label>
                Visitor Name <span className="required">*</span>
              </label>

              <input
                type="text"
                name="visitorName"
                value={form.visitorName}
                onChange={handleChange}
                placeholder="Enter visitor name"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>
                Phone <span className="required">*</span>
              </label>

              <input
                type="tel"
                name="visitorPhone"
                value={form.visitorPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="visitorEmail"
                value={form.visitorEmail}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            {/* Company */}
            <div className="form-group">
              <label>Company</label>

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            {/* Employee */}
            <div className="form-group">
              <label>
                Employee <span className="required">*</span>
              </label>

              <select
                name="employee"
                value={form.employee}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee._id}
                    value={employee._id}
                  >
                    {employee.name}
                    {employee.department
                      ? ` - ${employee.department}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Visit Date */}
            <div className="form-group">
              <label>
                Visit Date <span className="required">*</span>
              </label>

              <input
                type="date"
                name="visitDate"
                value={form.visitDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            {/* Arrival Time */}
            <div className="form-group">
              <label>
                Arrival Time <span className="required">*</span>
              </label>

              <input
                type="time"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Purpose */}
            <div className="form-group full">
              <label>
                Purpose <span className="required">*</span>
              </label>

              <textarea
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="Enter purpose of visit"
                rows="4"
                required
              />
            </div>

            {/* Remarks */}
            <div className="form-group full">
              <label>Remarks</label>

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Additional information"
                rows="3"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="form-actions">

            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate("/visitors")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading
                ? "Registering..."
                : "Register Visitor"}
            </button>

          </div>

        </form>
      </div>
    </>
  );
}

/* =========================================================
   USER MANAGEMENT
========================================================= */

function UserManagement() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  async function loadUsers() {
    try {
      setLoading(true);

      const response =
        await api.get("/users");

      setUsers(
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data.users ||
              []
      );
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  }

  async function createUser(event) {
    event.preventDefault();

    setSaving(true);

    try {
      await api.post(
        "/users",
        form
      );

      alert(
        "User account created successfully."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
      });

      await loadUsers();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to create user."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="User & Employee Management"
        description="Manage employee, receptionist and administrator accounts"
      />

      <div className="form-card">
        <h3>
          Create User Account
        </h3>

        <form onSubmit={createUser}>
          <div className="form-grid">
            <div className="form-group">
              <label>
                Full Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password *
              </label>

              <input
                type="password"
                name="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                Role *
              </label>

              <select
                name="role"
                value={form.role}
                onChange={
                  handleChange
                }
              >
                <option value="EMPLOYEE">
                  Employee
                </option>

                <option value="RECEPTIONIST">
                  Receptionist
                </option>

                <option value="ADMIN">
                  Administrator
                </option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={saving}
          >
            <UserPlus size={16} />

            {saving
              ? "Creating..."
              : "Create User"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <h3>
              User Accounts
            </h3>

            <p>
              {users.length} user(s)
            </p>
          </div>

          <button
            className="btn secondary"
            onClick={loadUsers}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {users.map(
                  (item) => (
                    <tr
                      key={
                        item._id
                      }
                    >
                      <td>
                        <strong>
                          {
                            item.name
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          item.email
                        }
                      </td>

                      <td>
                        <span className="role-badge">
                          {
                            item.role
                          }
                        </span>
                      </td>

                      <td>
                        {item.active ===
                        false
                          ? "Inactive"
                          : "Active"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function Reports() {
  const [report, setReport] =
    useState([]);

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function loadReport(
    fromDate = from,
    toDate = to
  ) {
    try {
      setLoading(true);

      const params = {};

      if (fromDate) {
        params.from = fromDate;
      }

      if (toDate) {
        params.to = toDate;
      }

      const response =
        await api.get(
          "/reports",
          { params }
        );

      setReport(
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data.report ||
              response.data.visitors ||
              []
      );
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  }

  function setToday() {
    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    setFrom(today);
    setTo(today);

    loadReport(today, today);
  }

  function setThisWeek() {
    const date = new Date();

    const day =
      date.getDay();

    const diff =
      day === 0 ? 6 : day - 1;

    const monday =
      new Date(date);

    monday.setDate(
      date.getDate() - diff
    );

    const sunday =
      new Date(monday);

    sunday.setDate(
      monday.getDate() + 6
    );

    const formatDate = (
      value
    ) =>
      value
        .toISOString()
        .split("T")[0];

    const start =
      formatDate(monday);

    const end =
      formatDate(sunday);

    setFrom(start);
    setTo(end);

    loadReport(start, end);
  }

  useEffect(() => {
    loadReport();
  }, []);

  const reportStats =
    useMemo(() => {
      return {
        total: report.length,

        pending:
          report.filter(
            (item) =>
              item.status ===
              "PENDING"
          ).length,

        approved:
          report.filter(
            (item) =>
              item.status ===
              "APPROVED"
          ).length,

        checkedIn:
          report.filter(
            (item) =>
              item.status ===
              "CHECKED_IN"
          ).length,

        checkedOut:
          report.filter(
            (item) =>
              item.status ===
              "CHECKED_OUT"
          ).length,

        rejected:
          report.filter(
            (item) =>
              item.status ===
              "REJECTED"
          ).length,
      };
    }, [report]);

  return (
    <>
      <PageHeader
        title="Reports"
        description="View visitor reports for today, this week or a custom date range"
      />

      <div className="filter-card">
        <div className="report-filters">
          <button
            className="btn secondary"
            onClick={setToday}
          >
            Today
          </button>

          <button
            className="btn secondary"
            onClick={setThisWeek}
          >
            This Week
          </button>

          <div className="form-group">
            <label>
              From
            </label>

            <input
              type="date"
              value={from}
              onChange={(event) =>
                setFrom(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              To
            </label>

            <input
              type="date"
              value={to}
              onChange={(event) =>
                setTo(
                  event.target.value
                )
              }
            />
          </div>

          <button
            className="btn primary"
            onClick={() =>
              loadReport()
            }
          >
            <BarChart3 size={16} />
            Generate
          </button>
        </div>
      </div>

      <div className="stats-grid report-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <ClipboardList />
          </div>

          <div>
            <p>Total Visitors</p>
            <h2>
              {reportStats.total}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock />
          </div>

          <div>
            <p>Pending</p>
            <h2>
              {reportStats.pending}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle />
          </div>

          <div>
            <p>Approved</p>
            <h2>
              {reportStats.approved}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <LogIn />
          </div>

          <div>
            <p>Checked In</p>
            <h2>
              {reportStats.checkedIn}
            </h2>
          </div>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <Loading />
        ) : report.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No report data"
            message="No visitor records exist for the selected period."
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Arrival</th>
                  <th>Purpose</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {report.map(
                  (item) => (
                    <tr
                      key={
                        item._id
                      }
                    >
                      <td>
                        {
                          item.visitorName
                        }
                      </td>

                      <td>
                        {
                          item.employee
                            ?.name
                        }

                        {!item.employee
                          ?.name &&
                          (item.employeeName ||
                            "-")}
                      </td>

                      <td>
                        {
                          item.visitDate
                        }
                      </td>

                      <td>
                        {
                          item.arrivalTime
                        }
                      </td>

                      <td>
                        {
                          item.purpose
                        }
                      </td>

                      <td>
                        <Status
                          value={
                            item.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   ACTIVITY HISTORY
========================================================= */

function ActivityHistory() {
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadActivity() {
    try {
      setLoading(true);

      const response =
        await api.get(
          "/activity"
        );

      setActivities(
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data.activities ||
              []
      );
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to load activity history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <>
      <PageHeader
        title="Activity History"
        description="Track important actions performed in the system"
        action={
          <button
            className="btn secondary"
            onClick={loadActivity}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <div className="table-card">
        {loading ? (
          <Loading />
        ) : activities.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No activity found"
            message="System actions will appear here."
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Visitor</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {activities.map(
                  (item) => (
                    <tr
                      key={
                        item._id
                      }
                    >
                      <td>
                        <strong>
                          {
                            item.action
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          item
                            .performedBy
                            ?.name
                        }
                      </td>

                      <td>
                        {
                          item.visitor
                            ?.visitorName
                        }
                      </td>

                      <td>
                        {
                          item.details ||
                          "-"
                        }
                      </td>

                      <td>
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   APP ROUTES
   IMPORTANT:
   BrowserRouter is NOT here.
   main.jsx should contain BrowserRouter.
========================================================= */

function App() {
  return (
    <Routes>
      {/* LOGIN */}

      <Route
        path="/login"
        element={
          isLoggedIn() ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* DASHBOARD */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* VISITORS */}

      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <Layout>
              <Visitors />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* REGISTER VISITOR */}

      <Route
        path="/register-visitor"
        element={
          <ProtectedRoute
            roles={[
              "ADMIN",
              "RECEPTIONIST",
            ]}
          >
            <Layout>
              <RegisterVisitor />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* USER MANAGEMENT */}

      <Route
        path="/users"
        element={
          <ProtectedRoute
            roles={["ADMIN"]}
          >
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* REPORTS */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute
            roles={["ADMIN"]}
          >
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ACTIVITY */}

      <Route
        path="/activity"
        element={
          <ProtectedRoute
            roles={["ADMIN"]}
          >
            <Layout>
              <ActivityHistory />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              isLoggedIn()
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

      {/* UNKNOWN URL */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isLoggedIn()
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;