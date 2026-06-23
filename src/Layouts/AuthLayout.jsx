import { Outlet } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";

const AuthLayout = () => {
  const { theme, toggle } = useTheme();

  return (
    <div className="auth-layout">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div className="sidebar-logo-icon">💰</div>
            <div>
              <div className="sidebar-logo-text">FinTrack</div>
              <div className="sidebar-logo-sub">Expense Tracker Pro</div>
            </div>
          </div>

          <h1 style={{ color: "#fff", fontSize: "2.25rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem" }}>
            Take control of your <span style={{ color: "#818cf8" }}>finances</span> today.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.7 }}>
            Track income, manage expenses, and gain insights into your spending habits with beautiful charts and real-time analytics.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2.5rem" }}>
            {[
              { icon: "📊", label: "Smart Analytics", desc: "Visual charts & trends" },
              { icon: "🔒", label: "Secure", desc: "JWT + HttpOnly cookies" },
              { icon: "📱", label: "Responsive", desc: "Works on any device" },
              { icon: "📤", label: "Export", desc: "PDF, Excel & CSV" },
            ].map((f) => (
              <div key={f.label} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.75rem",
                padding: "1rem",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>{f.icon}</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>{f.label}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right" style={{ position: "relative" }}>
        <button className="theme-toggle" onClick={toggle} style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
