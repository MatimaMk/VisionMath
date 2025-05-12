"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Card,
  Button,
  message,
  Spin,
  Empty,
  Modal,
  Alert,
} from "antd";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTestState, useTestAction } from "@/provider/test-provider";
import {
  TestWithQuestionsDto,
  SubmitTestAnswersDto,
} from "@/provider/test-provider/context";
import TestPreview from "@/components/student/testPreview";
import TestTaker from "@/components/student/writeTest";
import styles from "./styles/writeTest.module.css";

const { Title, Text, Paragraph } = Typography;

export default function TakeTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const { test, isPending, isError, submissionResult } = useTestState();
  const { getTestWithQuestions, submitTestAnswers } = useTestAction();

  const [isTestStarted, setIsTestStarted] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!testId) {
      getTestWithQuestions(testId);
    }
  }, [testId, getTestWithQuestions]);

  const handleStartTest = () => {
    setShowStartConfirm(true);
  };

  const confirmStartTest = () => {
    setShowStartConfirm(false);
    setIsTestStarted(true);
  };

  const handleSubmitTest = async (answers: SubmitTestAnswersDto) => {
    try {
      setSubmitting(true);
      await submitTestAnswers(answers);
      setSubmitting(false);

      // Redirect to results page
      if (submissionResult) {
        router.push(`/dashboard/student/tests/results?testId=${testId}`);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      message.error("Failed to submit test");
      setSubmitting(false);
    }
  };

  const typedTest = test as TestWithQuestionsDto | undefined;

  if (isPending) {
    return (
      <div className={styles.container}>
        <Spin size="large" className={styles.spinner} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <Card>
          <Empty
            description="Failed to load test details"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className={styles.errorActions}>
            <Button type="primary" onClick={() => getTestWithQuestions(testId)}>
              Try Again
            </Button>
            <Link href="/dashboard/educator/tests">
              <Button>Back to Tests</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!typedTest) {
    return (
      <div className={styles.container}>
        <Card>
          <Empty
            description="Test not found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className={styles.errorActions}>
            <Link href="/dashboard/student/tests">
              <Button type="primary">Back to Tests</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Test Preview/Instructions Screen
  if (!isTestStarted) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Link href="/dashboard/student/tests">
              <Button icon={<ArrowLeftOutlined />} type="text">
                Back to Tests
              </Button>
            </Link>
            <Title level={2}>{typedTest.title}</Title>
          </div>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="large"
            onClick={handleStartTest}
          >
            Start Test
          </Button>
        </div>

        <Card className={styles.instructionsCard}>
          <Title level={4}>Test Instructions</Title>
          <Alert
            message={`Time Limit: ${typedTest.timeLimitMinutes} minutes`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Paragraph>{typedTest.instructions}</Paragraph>
          <div className={styles.testInfo}>
            <div>
              <Text strong>Total Questions:</Text>
              <Text> {typedTest.questions.length}</Text>
            </div>
            <div>
              <Text strong>Passing Score:</Text>
              <Text> {typedTest.passingPercentage}%</Text>
            </div>
          </div>
        </Card>

        <div className={styles.previewContent}>
          <TestPreview test={typedTest} isPreview={true} />
        </div>

        <Modal
          title="Start Test"
          open={showStartConfirm}
          onOk={confirmStartTest}
          onCancel={() => setShowStartConfirm(false)}
          okText="Yes, I'm Ready"
          cancelText="Cancel"
        >
          <p>Are you ready to start this test?</p>
          <p>Once you start, the timer will begin and you cannot pause it.</p>
          <p>
            You will have {typedTest.timeLimitMinutes} minutes to complete the
            test.
          </p>
        </Modal>
      </div>
    );
  }

  // Test Taking Screen
  return (
    <div className={styles.container}>
      <TestTaker
        test={typedTest}
        onSubmit={handleSubmitTest}
        isSubmitting={submitting}
      />
    </div>
  );
}
