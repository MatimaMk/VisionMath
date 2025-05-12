"use client";

import { useEffect } from "react";
import { Typography, Card, Row, Col, Statistic, Spin, Button } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import StudentTestList from "@/components/test/testList";
import { useTestState, useTestAction } from "@/provider/test-provider";
import styles from "./styles/viewTest.module.css";

const { Title, Text } = Typography;

export default function StudentTestsPage() {
  const { tests, isPending, isError } = useTestState();
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

  // Mock statistics data for UI presentation
  // In a real app, this would come from an API call
  const stats = {
    availableTests: tests?.length || 0,
    completedTests: 3, // Mock data
    averageScore: 78, // Mock data
  };

  if (isPending && !tests) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading tests..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title level={2}>Available Tests</Title>
          <Text type="secondary">
            Browse and take tests to assess your knowledge
          </Text>
        </div>

        {isError && (
          <Button icon={<ReloadOutlined />} onClick={() => getAllTests()}>
            Reload Tests
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Statistic
              title="Available Tests"
              value={stats.availableTests}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tests Completed"
              value={stats.completedTests}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Statistic
              title="Average Score"
              value={stats.averageScore}
              suffix="%"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <StudentTestList />
    </div>
  );
}
