"use client";

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function StudentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

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
              icon: <VideoCameraOutlined />,
              label: "Student",
            },
            {
              key: "/studentDas",
              icon: <UserOutlined />,
              label: <Link href="/studentDash/imageAnalyzer">Content</Link>,
            },

            {
              key: "/studentDash/viewTest",
              icon: <UploadOutlined />,
              label: <Link href="/studentDash/ViewTest">Tests</Link>,
            },

            {
              key: "/studentDash/QnAGenerator",
              icon: <UploadOutlined />,
              label: (
                <Link href="/studentDash/qnaGenerator">AI QuestionsG</Link>
              ),
            },
            {
              key: "/studentDash/imageAnalyzer",
              icon: <UploadOutlined />,
              label: <Link href="/studentDash/imageAnalyzer">VisionMath</Link>,
            },
            {
              key: "/studentDash/progress",
              icon: <UploadOutlined />,
              label: <Link href="/studentDash/progress">Progress</Link>,
            },
          ]}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
