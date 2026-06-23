import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/api.service";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onsubmit = async (v) => {
    v.preventDefault();

    setLoading(true);

    const formData = new FormData(v.target);

    const data = {
      Name: formData.get("Name"),
      Email: formData.get("Email"),
      password: formData.get("password"),
      Phone: formData.get("Phone"),
    };

    try {
      const response = await authService.signup(data);

      toast.success("OTP sent successfully!");

      navigate("/Verify-otp", {
        state: { Email: data.Email },
      });

      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
          class="mx-auto h-10 w-auto"
        />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign up to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onsubmit} class="space-y-6">
          <div>
            <label for="name" class="block text-sm/6 font-medium text-gray-100">
              Full Name
            </label>
            <div class="mt-2">
              <input
                id="name"
                type="text"
                name="Name"
                required
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              for="email"
              class="block text-sm/6 font-medium text-gray-100"
            >
              Email address
            </label>
            <div class="mt-2">
              <input
                id="email"
                type="email"
                name="Email"
                required
                autocomplete="email"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              for="Phone"
              class="block text-sm/6 font-medium text-gray-100"
            >
              Phone Number
            </label>
            <div class="mt-2">
              <input
                id="Phone"
                type="text"
                name="Phone"
                required
                autocomplete="email"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div class="text-sm">
                <a
                  href="#"
                  class="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div class="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                autocomplete="current-password"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-400">
          Already have an Account
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
