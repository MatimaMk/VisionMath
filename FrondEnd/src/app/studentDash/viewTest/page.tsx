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
    console.log("Student Tests Page: Fetching all tests");
    getAllTests();
  }, [getAllTests]);

  // Log when tests are loaded
  useEffect(() => {
    if (tests) {
      console.log("Tests loaded in page:", tests.length);
    }
  }, [tests]);

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
