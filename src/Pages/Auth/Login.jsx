import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../Services/api.service";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    try {
      const res = await authService.login({ Email: fd.get("Email"), password: fd.get("password") });
      login(res.data.user || {});
      toast.success("Welcome back! 🎉");
      navigate("/app/user/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div className="sidebar-logo-icon" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>💰</div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>FinTrack</span>
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.375rem" }}>Welcome back</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Sign in to your account to continue</p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" name="Email" placeholder="you@example.com" required />
        </div>

        <div className="form-group">
          <div className="flex-between" style={{ marginBottom: "0.375rem" }}>
            <label className="form-label" style={{ margin: 0 }}>Password</label>
            <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
              style={{ paddingRight: "2.75rem" }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1rem" }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" />Signing in...</> : "Sign in"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Create one free</Link>
      </p>
    </div>
  );
};

export default Login;
