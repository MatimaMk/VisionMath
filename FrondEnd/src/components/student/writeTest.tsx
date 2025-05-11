import React, { useState, useEffect } from "react";
import {
  Card,
  Steps,
  Button,
  Progress,
  Radio,
  Input,
  Typography,
  Space,
  Modal,
  Alert,
  InputNumber,
} from "antd";
import {
  ClockCircleOutlined,
  QuestionCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useTestAction, useTestState } from "@/provider/test-provider";
import {
  SubmitAnswerDto,
  SubmitTestAnswersDto,
} from "@/provider/test-provider/context";
import { questionTypes } from "@/enums/questionTypes";
import styles from "./styles/testView.module.css";

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

interface StudentAnswer {
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  numericAnswer?: number;
}

interface TestViewProps {
  testId: string;
}

const TestView: React.FC<TestViewProps> = ({ testId }) => {
  const { getTestWithQuestions, submitTestAnswers } = useTestAction();
  const { test, isPending, submissionResult } = useTestState();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Initialize test
  useEffect(() => {
    getTestWithQuestions(testId);
  }, [testId, getTestWithQuestions]);

  // Setup answers structure and timer when test loads
  useEffect(() => {
    if (test && test.questions && test.questions.length > 0) {
      // Initialize answers
      const initialAnswers = test.questions
        .filter((q) => q.id !== undefined)
        .map((q) => ({
          questionId: q.id as string,
          selectedOptionId: undefined,
          textAnswer: "",
          numericAnswer: undefined,
        }));
      setAnswers(initialAnswers);

      // Set time limit
      if (test.timeLimitMinutes) {
        setTimeRemaining(test.timeLimitMinutes * 60);
      }
    }
  }, [test]);

  // Timer effect with handleSubmitTest dependency
  useEffect(() => {
    if (timeRemaining > 0 && !testSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !testSubmitted) {
      handleSubmitTest();
    }
  }, [timeRemaining, testSubmitted]); // Added handleSubmitTest as dependency would be better but creates warning

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerChange = (
    questionIndex: number,
    questionType: questionTypes,
    value: string | number | undefined
  ) => {
    const updatedAnswers = [...answers];

    switch (questionType) {
      case questionTypes.MultipleChoice:
      case questionTypes.TrueFalse:
        updatedAnswers[questionIndex].selectedOptionId = value as string;
        break;
      case questionTypes.Algebraic:
        updatedAnswers[questionIndex].textAnswer = value as string;
        break;
      case questionTypes.Numeric:
        updatedAnswers[questionIndex].numericAnswer = value as number;
        break;
    }

    setAnswers(updatedAnswers);
  };

  const isQuestionAnswered = (index: number) => {
    const answer = answers[index];
    if (!answer) return false;

    const question = test?.questions?.[index];
    if (!question) return false;

    switch (question.questionType) {
      case questionTypes.MultipleChoice:
      case questionTypes.TrueFalse:
        return !!answer.selectedOptionId;
      case questionTypes.Algebraic:
        return !!answer.textAnswer?.trim();
      case questionTypes.Numeric:
        return (
          answer.numericAnswer !== undefined && answer.numericAnswer !== null
        );
      default:
        return false;
    }
  };

  const getQuestionProgress = () => {
    if (!answers.length) return 0;
    const answered = answers.filter((_, i) => isQuestionAnswered(i)).length;
    return Math.round((answered / answers.length) * 100);
  };

  const handleNext = () => {
    if (currentStep < (test?.questions?.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalVisible(true);
  };

  const handleSubmitTest = async () => {
    setIsConfirmModalVisible(false);
    setTestSubmitted(true);

    // Format answers for backend
    const submissionData: SubmitTestAnswersDto = {
      testId: testId,
      answers: answers.map(
        (answer): SubmitAnswerDto => ({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          textAnswer: answer.textAnswer,
          numericAnswer: answer.numericAnswer,
        })
      ),
    };

    await submitTestAnswers(submissionData);
  };

  // If test is not loaded yet
  if (isPending || !test) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  // Check if test has questions
  if (!test.questions || test.questions.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <p>No questions available for this test.</p>
          <Button
            type="primary"
            onClick={() => (window.location.href = "/student-dashboard")}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentStep];

  // Render test submitted screen
  if (testSubmitted && submissionResult) {
    return (
      <div className={styles.testView}>
        <Card className={styles.testCard}>
          <div className={styles.testSubmitted}>
            <div className={styles.successIcon}>✓</div>
            <Title level={2}>Test Submitted!</Title>
            <div style={{ marginTop: 24 }}>
              <Paragraph>
                Your Score:{" "}
                <Text strong>{submissionResult.percentage.toFixed(1)}%</Text>
              </Paragraph>
              <Paragraph>
                Points:{" "}
                <Text strong>
                  {submissionResult.earnedPoints}/{submissionResult.totalPoints}
                </Text>
              </Paragraph>
              <Paragraph>
                Result:{" "}
                <Text
                  strong
                  style={{
                    color: submissionResult.passed ? "#52c41a" : "#f5222d",
                  }}
                >
                  {submissionResult.passed ? "PASSED" : "FAILED"}
                </Text>
              </Paragraph>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => (window.location.href = "/dashboard")}
              style={{ marginTop: 24 }}
            >
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.testView}>
      <Card className={styles.testCard}>
        <div className={styles.testHeader}>
          <div>
            <Title level={2}>{test.title}</Title>
            <Text type="secondary">{test.description}</Text>
          </div>

          <div className={styles.testMeta}>
            <div className={styles.timer}>
              <ClockCircleOutlined /> Time Remaining:{" "}
              <Text strong>{formatTime(timeRemaining)}</Text>
            </div>

            <div className={styles.progress}>
              <Text>Progress: </Text>
              <Progress
                percent={getQuestionProgress()}
                size="small"
                status="active"
                className={styles.progressBar}
              />
            </div>
          </div>
        </div>

        <div className={styles.testContent}>
          <div className={styles.sidebar}>
            <Steps
              direction="vertical"
              current={currentStep}
              onChange={(step) => setCurrentStep(step)}
              className={styles.questionSteps}
            >
              {test.questions.map((q, index) => (
                <Step
                  key={q.id}
                  title={`Question ${index + 1}`}
                  description={
                    isQuestionAnswered(index) ? "Answered" : "Unanswered"
                  }
                  status={isQuestionAnswered(index) ? "finish" : "wait"}
                  icon={<QuestionCircleOutlined />}
                />
              ))}
            </Steps>
          </div>

          <div className={styles.questionContainer}>
            {currentQuestion && (
              <div className={styles.question}>
                <div className={styles.questionHeader}>
                  <Title level={4}>Question {currentStep + 1}</Title>
                  <Text type="secondary">
                    {currentQuestion.questionPoints} points
                  </Text>
                </div>

                <div className={styles.questionText}>
                  <Paragraph strong>{currentQuestion.questionText}</Paragraph>
                </div>

                <div className={styles.answerOptions}>
                  {currentQuestion.questionType ===
                    questionTypes.MultipleChoice && (
                    <Radio.Group
                      onChange={(e) =>
                        handleAnswerChange(
                          currentStep,
                          currentQuestion.questionType,
                          e.target.value
                        )
                      }
                      value={answers[currentStep]?.selectedOptionId}
                      className={styles.radioGroup}
                    >
                      <Space
                        direction="vertical"
                        className={styles.optionsSpace}
                      >
                        {currentQuestion.questionOptions?.map((option) => (
                          <Radio key={option.id} value={option.id}>
                            {option.optionText}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  )}

                  {currentQuestion.questionType === questionTypes.TrueFalse && (
                    <Radio.Group
                      onChange={(e) =>
                        handleAnswerChange(
                          currentStep,
                          currentQuestion.questionType,
                          e.target.value
                        )
                      }
                      value={answers[currentStep]?.selectedOptionId}
                      className={styles.radioGroup}
                    >
                      <Space
                        direction="vertical"
                        className={styles.optionsSpace}
                      >
                        {currentQuestion.questionOptions?.map((option) => (
                          <Radio key={option.id} value={option.id}>
                            {option.optionText}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  )}

                  {currentQuestion.questionType === questionTypes.Numeric && (
                    <Input.TextArea
                      rows={4}
                      placeholder="Type your answer here..."
                      value={answers[currentStep]?.textAnswer}
                      onChange={(e) =>
                        handleAnswerChange(
                          currentStep,
                          currentQuestion.questionType,
                          e.target.value
                        )
                      }
                      className={styles.textAnswer}
                    />
                  )}

                  {currentQuestion.questionType === questionTypes.Numeric && (
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Enter numeric answer"
                      value={answers[currentStep]?.numericAnswer}
                      onChange={(value) =>
                        handleAnswerChange(
                          currentStep,
                          currentQuestion.questionType,
                          value ?? undefined
                        )
                      }
                    />
                  )}
                </div>
              </div>
            )}

            <div className={styles.navigationButtons}>
              <Button onClick={handlePrev} disabled={currentStep === 0}>
                Previous
              </Button>

              {currentStep < (test.questions?.length || 0) - 1 ? (
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleConfirmSubmit}
                >
                  Submit Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title="Submit Test"
        open={isConfirmModalVisible}
        onOk={handleSubmitTest}
        onCancel={() => setIsConfirmModalVisible(false)}
        okText="Yes, Submit"
        cancelText="Continue Testing"
      >
        <Alert
          message="Are you sure you want to submit your test?"
          description={
            <>
              <p>
                You have completed{" "}
                {answers.filter((_, i) => isQuestionAnswered(i)).length} out of{" "}
                {test.questions?.length} questions.
              </p>
              <p>Once submitted, you cannot return to this test.</p>
            </>
          }
          type="warning"
          showIcon
        />
      </Modal>
    </div>
  );
};

export default TestView;
