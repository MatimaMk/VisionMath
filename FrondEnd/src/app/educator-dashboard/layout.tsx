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

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
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
              key: "/educator-dashboard",
              icon: <UserOutlined />,
              label: "Student",
            },
            {
              key: "/educator-dashboard/topic",
              icon: <VideoCameraOutlined />,
              label: <Link href="/educator-dashboard/topic">Topics</Link>,
            },
            {
              key: "/educator-dashboard/content",
              icon: <UploadOutlined />,
              label: <Link href="/educator-dashboard/content">Content</Link>,
            },
            {
              key: "/educator-dashboard/test",
              icon: <UploadOutlined />,
              label: <Link href="/educator-dashboard/test">Test</Link>,
            },
            {
              key: "/educator-dashboard/createTest",
              icon: <UploadOutlined />,
              label: (
                <Link href="/educator-dashboard/createTest">Create Test</Link>
              ),
            },

            {
              key: "/student-dashboard/writeTest",
              icon: <UploadOutlined />,
              label: (
                <Link href="/educator-dashboard/writeTest">write Test</Link>
              ),
            },
            {
              key: "/student-dashboard/viewTest",
              icon: <UploadOutlined />,
              label: (
                <Link href="/educator-dashboard/viewTest">
                  Student View Test
                </Link>
              ),
            },
          ]}
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
