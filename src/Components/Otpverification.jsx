import React, { useState } from "react";
import { authService } from "../Services/api.service";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const Email = location.state?.Email || "";
const isReset = location.state?.isReset || false;
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isReset) {
      await authService.verifyResetOtp({ Email, otp });

      navigate("/reset-password", {
        state: { Email },
      });
    } else {
      await authService.verifyOtp({ Email, otp });

      navigate("/login");
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-xl w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">
          Verify OTP
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border p-3 rounded-lg mb-4 text-center text-xl tracking-[8px]"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;