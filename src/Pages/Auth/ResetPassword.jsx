import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../Services/api.service";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.Email || sessionStorage.getItem("reset_email") || "";
  const [step, setStep] = useState(1); // 1: verify OTP, 2: new password
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyResetOtp({ Email: email, otp });
      toast.success("OTP verified!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const password = fd.get("password");
    const confirm = fd.get("confirm");
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ Email: email, password, otp });
      toast.success("Password reset successfully! 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔑</div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.375rem" }}>
          {step === 1 ? "Enter OTP" : "Set new password"}
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          {step === 1 ? `Check ${email} for your reset OTP` : "Choose a strong new password"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={verifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label">Reset OTP</label>
            <input className="form-input" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" />Verifying...</> : "Verify OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" name="password" placeholder="Create new password" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" name="confirm" placeholder="Repeat new password" required />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" />Resetting...</> : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
