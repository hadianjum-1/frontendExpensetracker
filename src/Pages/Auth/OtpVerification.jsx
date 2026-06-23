import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../Services/api.service";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.Email || sessionStorage.getItem("otp_email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter all 6 digits"); return; }
    setLoading(true);
    try {
      await authService.verifyOtp({ otp: code, Email: email });
      toast.success("Account verified! Please log in. ✅");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.5rem" }}>Check your email</h2>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
        We sent a 6-digit code to
      </p>
      <p style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "2rem" }}>{email}</p>

      <form onSubmit={onSubmit}>
        <div className="otp-group" onPaste={handlePaste} style={{ marginBottom: "2rem" }}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              className="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" />Verifying...</> : "Verify Account"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        Didn't receive the code?{" "}
        <button style={{ background: "none", border: "none", color: "var(--color-primary)", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default OtpVerification;
