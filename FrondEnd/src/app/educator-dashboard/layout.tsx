"use client";

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  RobotOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "../../provider/auth-provider";

const { Header, Sider, Content } = Layout;

export default function StudentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { logout } = useAuthActions(); // Access logout function

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "/studentDash",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "/studentDash/viewTest",
              icon: <UserOutlined />,
              label: <Link href="/studentDash/ViewTest">Tests</Link>,
            },
            {
              key: "/studentDash/mathTest",
              icon: <RobotOutlined />,
              label: <Link href="/studentDash/mathTest">AI Test</Link>,
            },
            {
              key: "/studentDash/imageAnalyzer",
              icon: <CalculatorOutlined />,
              label: <Link href="/studentDash/imageAnalyzer">VisionMath</Link>,
            },
            {
              key: "/studentDash/questionGenerator",
              icon: <FileTextOutlined />,
              label: (
                <Link href="studentDash/questionGenerator">Pdf Questions</Link>
              ),
            },
          ]}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          {/* Logout button in the corner */}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
            style={{
              fontSize: "16px",
              marginRight: "16px",
            }}
          >
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
