import React, { useState } from "react";
import { authService } from "../Services/api.service";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const data = {
      Email: formData.get("Email"),
    };

    try {
      const response = await authService.forgotPassword(data);

      toast.success(response.data.message);

      navigate("/verify-otp", {
        state: {
          Email: data.Email,
          isReset: true,
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="Email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white outline-none border border-gray-600 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md font-semibold disabled:opacity-70"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Forgot;