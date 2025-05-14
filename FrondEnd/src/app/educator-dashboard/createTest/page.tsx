"use client";

import { useEffect } from "react";
import { Typography, message } from "antd";
import { useTestState, useTestAction } from "@/provider/test-provider";
import TestForm from "@/components/test/testBuilder";
import styles from "./styles/creatTest.module.css";

const { Title, Text } = Typography;

export default function CreateTestPage() {
  const { isPending, isSuccess, isError } = useTestState();
  const { createTest } = useTestAction();

  useEffect(() => {
    if (isSuccess) {
      message.success("Test created successfully!");
    }

    if (isError) {
      message.error("Failed to create test");
    }
  }, [isSuccess, isError]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>Create New Test</Title>
        <Text type="secondary">
          Create a new test with questions and options
        </Text>
      </div>

      <TestForm onSubmit={createTest} isSubmitting={isPending} />
    </div>
  );
}
