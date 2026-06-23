import React from "react";
import { Layout } from "antd";
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Meader from "../Components/Header";

const { Footer, Content } = Layout;

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLogin = location.pathname === '/' || location.pathname.endsWith('/login')
  return (
    <Layout className="bg-white">
      <Meader/>
      <Content>
        <section className="w-[90vw] mx-auto min-h-[70vh] mt-14 flex">
          <div className="t1 p-2.5 w-[50%] pt-20">
            <h1 className="text-5xl mb-2 font-extrabold">
              Expense Tracker
            </h1>
            <p className="text-3xl text-gray-400 mb-7">
              Now you can track your expenses, financial assets and more
            </p>

            <button
              onClick={() => navigate(isLogin ? 'signup' : 'login')}
              className="py-2.5 px-5 bg-black text-white rounded-2xl"
            >
              {isLogin ? "Go to Signup" : "Go to Login"}
            </button>
          </div>

          <div className="t2 p-2.5 w-[50%] pt-20 bg-gray-600 rounded-4xl">
            <Outlet />
          </div>
        </section>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Home;