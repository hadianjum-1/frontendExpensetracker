import React, { useState } from "react";
import { authService } from "../Services/api.service";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const Email = location.state?.Email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.resetPassword({ Email, password });

      alert("Password Updated Successfully");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;