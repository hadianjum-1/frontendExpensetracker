import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../Services/api.service";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const data = { Name: fd.get("Name"), Email: fd.get("Email"), Phone: fd.get("Phone"), password: fd.get("password") };
    try {
      await authService.signup(data);
      sessionStorage.setItem("otp_email", data.Email);
      toast.success("OTP sent to your email! 📧");
      navigate("/Verify-otp", { state: { Email: data.Email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div className="sidebar-logo-icon" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>💰</div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>FinTrack</span>
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.375rem" }}>Create your account</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Start tracking your finances today</p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" type="text" name="Name" placeholder="John Doe" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" name="Email" placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-input" type="tel" name="Phone" placeholder="+1 234 567 8900" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              required
              style={{ paddingRight: "2.75rem" }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1rem" }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: "0.25rem" }}>
          {loading ? <><span className="spinner" />Sending OTP...</> : "Create Account"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
