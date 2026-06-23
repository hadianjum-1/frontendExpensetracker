import React from "react";
import {
  AppstoreAddOutlined,
  BarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import useSwr from 'swr';
import Fetcher from "./Fetcher.js";
import { authService } from "../Services/api.service";

const { Sider, Header, Content } = Layout;

const items = [
  {
    key: "/app/user/dashboard",
    label: "Dashboard",
    icon: <AppstoreAddOutlined />,
  },
  {
    key: "/app/user/reports",
    label: "Reports",
    icon: <BarChartOutlined />,
  },
];

const Userlayout = () => {
    const { data: session, error, isLoading } = useSwr('/user/check-auth', Fetcher);
  const navigate = useNavigate();

  const profileMenu = [
    {
      key: "profile",
      label: "Profile",
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      // call server logout to clear HttpOnly cookie
      authService.logout().finally(() => {
        localStorage.clear();
        navigate('/login');
      });
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider collapsible>
        <img
          src="https://i.pravatar.cc/100"
          alt="logo"
          className="w-14 h-14 rounded-full mx-auto my-4"
        />

        <Menu
          theme="dark"
          mode="inline"
          items={items}
          defaultSelectedKeys={["/app/user/dashboard"]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="bg-white flex justify-between items-center px-6 shadow">
          <h2 className="text-lg font-semibold m-0 text-amber-50">
            Expense Tracker
          </h2>

          <Dropdown
            menu={{
              items: profileMenu,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
          >
            <Avatar
              size={40}
              icon={<UserOutlined />}
              className="cursor-pointer"
            />
          </Dropdown>
        </Header>

        {/* Page Content */}
        <Content className="p-6 bg-gray-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Userlayout;