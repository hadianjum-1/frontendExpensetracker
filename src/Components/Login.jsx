
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Services/api.service";
import {ToastContainer, toast} from 'react-toastify'

const Login = () => {
  const navigate = useNavigate();
  const [loading , Setloading] = useState(false);
  const onsubmit = async (e)=>{
    e.preventDefault()
    Setloading(true)
    const formdata = new FormData(e.target);

    const data = {
      Email : formdata.get("Email"),
      password : formdata.get("password"),
    }

    try{
      const response = await authService.login(data);
      console.log("login response:", response);
      console.log("login response headers:", response.headers);
      const {role} = response.data;
      toast.success("Login Successful");

  if (role === "admin") {
    navigate("/app/admin");
  } else {
    navigate("/app/user");
  }
    }
    catch(error){
       console.error("login error response data:", error.response?.data || error.message);
       console.error("login error response headers:", error.response?.headers);
       Setloading(false)
    }
  }
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
          class="mx-auto h-10 w-auto"
        />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Log in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" onSubmit={onsubmit}>
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
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div class="text-sm">
                
                
                 <Link to={'/forgot-password'}  className="font-semibold text-indigo-400 hover:text-indigo-300" >Forgot password?</Link> 
                
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
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed"
            >
              {loading ? (
                 <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Log-in...
                </div>
              ):(  'Log-in'

              )}
           
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?
          <Link
            to="/signup"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
