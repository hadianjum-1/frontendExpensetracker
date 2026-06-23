import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { authService } from "../Services/api.service";
import { toast } from "react-toastify";

const NAV_ITEMS = [
  { path: "/app/user/dashboard",   label: "Dashboard",   icon: "⊞" },
  { path: "/app/user/expenses",    label: "Expenses",    icon: "💸" },
  { path: "/app/user/income",      label: "Income",      icon: "💵" },
  { path: "/app/user/categories",  label: "Categories",  icon: "🏷️" },
  { path: "/app/user/reports",     label: "Reports",     icon: "📊" },
  { path: "/app/user/profile",     label: "Profile",     icon: "👤" },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      logout();
      navigate("/login");
    }
  };

  const currentPage = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.label || "Dashboard";
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "U";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💰</div>
        <div>
          <div className="sidebar-logo-text">FinTrack</div>
          <div className="sidebar-logo-sub">Expense Tracker</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Main Menu</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            className={`sidebar-link ${location.pathname.startsWith(item.path) ? "active" : ""}`}
            onClick={() => { navigate(item.path); setSidebarOpen(false); }}
          >
            <span style={{ fontSize: "1rem" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.avatar ? <img src={user.avatar} alt="avatar" /> : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{user?.name || "User"}</div>
            <div className="sidebar-user-email">{user?.email || ""}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "1.1rem", padding: "4px" }}
          >
            ⏻
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="btn-icon hamburger" onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="topbar-title">{currentPage}</h1>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggle} title="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="sidebar-avatar" style={{ width: 36, height: 36, cursor: "pointer" }} onClick={() => navigate("/app/user/profile")}>
              {user?.avatar ? <img src={user.avatar} alt="avatar" /> : initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
