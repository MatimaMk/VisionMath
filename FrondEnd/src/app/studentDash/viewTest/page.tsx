"use client";

import StudentTestList from "@/components/test/testList";
import { useTestAction, useTestState } from "@/provider/test-provider";
import { Spin } from "antd";
import { useEffect } from "react";
import styles from "./styles/viewTest.module.css";

export default function StudentTestsPage() {
  const { tests, isPending } = useTestState();
  const { getAllTests } = useTestAction();

  // Fetch all tests when the page loads
  useEffect(() => {
    getAllTests();
  }, [getAllTests]);

  if (isPending && !tests) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading tests..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentTestList />
    </div>
  );
}
