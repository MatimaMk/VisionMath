"use client";

import { useUserState, useUserActions } from "@/provider/users-provider";
import { Card, Skeleton } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";

function WelcomePage() {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!hasFetched && token) {
      setHasFetched(true);
      getCurrentUser(token);
    }
  }, [hasFetched, getCurrentUser]);

  if (!hasFetched || !currentUser) {
    // still fetching, show skeleton
    return (
      <Card style={{ width: 300, marginTop: 16 }}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  return (
    <Card
      title={`👋 Welcome, ${currentUser.name || "User"}`}
      bordered={false}
      style={{ width: 300, marginTop: 16 }}
    >
      <Title level={5}>Full Name</Title>
      <Paragraph>{currentUser.name || "Not provided"}</Paragraph>

      <Title level={5}>Email</Title>
      <Paragraph>{currentUser.emailAddress || "Not provided"}</Paragraph>

      <Title level={5}>Surname</Title>
      <Paragraph>{currentUser.surname || "Not specified"}</Paragraph>
    </Card>
  );
}

export default WelcomePage;
