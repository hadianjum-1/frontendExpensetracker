import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../Services/api.service";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get("Email");
    setLoading(true);
    try {
      await authService.forgotPassword({ Email: email });
      sessionStorage.setItem("reset_email", email);
      toast.success("Reset OTP sent to your email!");
      navigate("/reset-password", { state: { Email: email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔐</div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.375rem" }}>Forgot password?</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Enter your email and we'll send you a reset OTP</p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" name="Email" placeholder="you@example.com" required />
        </div>
        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" />Sending...</> : "Send Reset OTP"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        Remember your password?{" "}
        <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
