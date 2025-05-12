"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Radio,
  Space,
  Button,
  Progress,
  Input,
  InputNumber,
  Divider,
  Alert,
  Badge,
  Statistic,
  Modal,
} from "antd";
import {
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  TestWithQuestionsDto,
  QuestionDto,
  SubmitTestAnswersDto,
  SubmitAnswerDto,
} from "@/provider/test-provider/context";
import { questionTypes } from "@/enums/questionTypes";
import styles from "./styles/testPreview.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Countdown } = Statistic;

interface TestTakerProps {
  test: TestWithQuestionsDto;
  onSubmit: (answers: SubmitTestAnswersDto) => Promise<void>;
  isSubmitting: boolean;
}

const TestTaker = ({ test, onSubmit, isSubmitting }: TestTakerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SubmitAnswerDto[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [hasTimeExpired, setHasTimeExpired] = useState(false);

  useEffect(() => {
    // Initialize empty answers for all questions
    if (test && test.questions) {
      const initialAnswers = test.questions.map((question) => ({
        questionId: question.id as string,
        selectedOptionId: undefined,
        textAnswer: undefined,
        numericAnswer: undefined,
      }));
      setAnswers(initialAnswers);

      // Set countdown timer
      if (test.timeLimitMinutes) {
        const timeLimit = parseInt(test.timeLimitMinutes) * 60 * 1000; // Convert to milliseconds
        setCountdown(Date.now() + timeLimit);
      }
    }
  }, [test]);

  const currentQuestion = test?.questions?.[currentQuestionIndex];

  // Improved type safety by specifying the exact types for different question types
  // Updated to handle null values from InputNumber
  const handleAnswerChange = (
    value: string | number | null | undefined,
    type: questionTypes
  ) => {
    const newAnswers = [...answers];

    if (
      type === questionTypes.MultipleChoice ||
      type === questionTypes.TrueFalse
    ) {
      // For multiple choice/true-false, value is a string (option ID)
      newAnswers[currentQuestionIndex].selectedOptionId = value as string;
    } else if (type === questionTypes.FillInTheBlank) {
      // For fill in the blank, value is a string (text answer)
      newAnswers[currentQuestionIndex].textAnswer = value as string;
    } else if (type === questionTypes.Numeric) {
      // For numeric, value is a number or null (from InputNumber component)
      newAnswers[currentQuestionIndex].numericAnswer =
        value === null ? undefined : (value as number);
    }

    setAnswers(newAnswers);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (test?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitTest = async () => {
    setShowConfirmSubmit(false);
    if (test?.id) {
      const submitData: SubmitTestAnswersDto = {
        testId: test.id,
        answers: answers.filter(
          (answer) =>
            answer.selectedOptionId ||
            answer.textAnswer ||
            answer.numericAnswer !== undefined
        ),
      };
      await onSubmit(submitData);
    }
  };

  const renderAnswerInput = (question: QuestionDto) => {
    const answer = answers[currentQuestionIndex];

    switch (question.questionType) {
      case questionTypes.MultipleChoice:
        return (
          <Radio.Group
            onChange={(e) =>
              handleAnswerChange(e.target.value, question.questionType)
            }
            value={answer?.selectedOptionId}
            className={styles.optionsGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {question.questionOptions?.map((option) => (
                <Radio
                  key={option.id}
                  value={option.id}
                  className={styles.optionRadio}
                >
                  {option.optionText}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case questionTypes.TrueFalse:
        return (
          <Radio.Group
            onChange={(e) =>
              handleAnswerChange(e.target.value, question.questionType)
            }
            value={answer?.selectedOptionId}
            className={styles.optionsGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {question.questionOptions?.map((option) => (
                <Radio
                  key={option.id}
                  value={option.id}
                  className={styles.optionRadio}
                >
                  {option.optionText}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case questionTypes.FillInTheBlank:
        return (
          <TextArea
            placeholder="Type your answer here"
            value={answer?.textAnswer}
            onChange={(e) =>
              handleAnswerChange(e.target.value, question.questionType)
            }
            className={styles.textAnswer}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        );

      case questionTypes.Numeric:
        return (
          <InputNumber
            placeholder="Enter your numeric answer"
            value={answer?.numericAnswer}
            onChange={(value) =>
              handleAnswerChange(value, question.questionType)
            }
            className={styles.numericAnswer}
          />
        );

      default:
        return null;
    }
  };

  const countAnswered = () => {
    return answers.filter(
      (answer) =>
        answer.selectedOptionId ||
        answer.textAnswer ||
        answer.numericAnswer !== undefined
    ).length;
  };

  const handleCountdownFinish = () => {
    setHasTimeExpired(true);
    // Auto-submit on time expiry
    setShowConfirmSubmit(true);
  };

  const renderQuestionCard = () => {
    if (!currentQuestion) return null;

    return (
      <Card className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <Title level={5}>
            Question {currentQuestionIndex + 1} of {test?.questions?.length}
          </Title>
          <Text type="secondary">Points: {currentQuestion.questionPoints}</Text>
        </div>

        <Divider />

        <div className={styles.questionContent}>
          <Paragraph className={styles.questionText}>
            {currentQuestion.questionText}
          </Paragraph>

          <div className={styles.answerSection}>
            {renderAnswerInput(currentQuestion)}
          </div>
        </div>

        <Divider />

        <div className={styles.questionNavigation}>
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            icon={<LeftOutlined />}
          >
            Previous
          </Button>

          <Button
            type="primary"
            onClick={handleNextQuestion}
            disabled={
              currentQuestionIndex === (test?.questions?.length || 0) - 1
            }
          >
            Next <RightOutlined />
          </Button>
        </div>
      </Card>
    );
  };

  const renderProgressInfo = () => (
    <Card className={styles.progressCard}>
      <div className={styles.timerSection}>
        <Text strong>
          <ClockCircleOutlined /> Time Remaining:
        </Text>
        {countdown && (
          <Countdown
            value={countdown}
            format="HH:mm:ss"
            onFinish={handleCountdownFinish}
          />
        )}
      </div>

      <Divider />

      <div>
        <Text strong>Progress:</Text>
        <Progress
          percent={Math.round(
            (countAnswered() / (test?.questions?.length || 1)) * 100
          )}
          format={() => `${countAnswered()}/${test?.questions?.length}`}
        />
      </div>

      <Divider />

      <div className={styles.questionNavSection}>
        <Text strong>Questions:</Text>
        <div className={styles.questionBadges}>
          {test?.questions?.map((_, index) => {
            const isAnswered = !!(
              answers[index]?.selectedOptionId ||
              answers[index]?.textAnswer ||
              answers[index]?.numericAnswer !== undefined
            );

            return (
              <Badge
                key={index}
                count={index + 1}
                className={`${styles.questionBadge} ${
                  index === currentQuestionIndex ? styles.currentBadge : ""
                }`}
                style={{
                  backgroundColor: isAnswered ? "#52c41a" : "#d9d9d9",
                }}
                onClick={() => setCurrentQuestionIndex(index)}
              />
            );
          })}
        </div>
      </div>

      <Divider />

      <Button
        type="primary"
        block
        icon={<CheckOutlined />}
        onClick={() => setShowConfirmSubmit(true)}
        disabled={countAnswered() === 0}
      >
        Submit Test
      </Button>
    </Card>
  );

  return (
    <div className={styles.testTakerContainer}>
      <div className={styles.testHeader}>
        <Title level={3}>{test?.title}</Title>
        <Text type="secondary">{test?.description}</Text>
      </div>

      {hasTimeExpired && (
        <Alert
          message="Time Expired"
          description="Your time has expired. Please submit your test."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div className={styles.testContent}>
        <div className={styles.questionSection}>{renderQuestionCard()}</div>
        <div className={styles.progressSection}>{renderProgressInfo()}</div>
      </div>

      <Modal
        title="Submit Test"
        open={showConfirmSubmit}
        onOk={handleSubmitTest}
        onCancel={() => setShowConfirmSubmit(false)}
        okText="Yes, Submit"
        confirmLoading={isSubmitting}
      >
        <p>Are you sure you want to submit your test?</p>
        <p>
          You have answered {countAnswered()} out of {test?.questions?.length}{" "}
          questions.
        </p>
        {countAnswered() < (test?.questions?.length || 0) && (
          <Alert
            message="Warning"
            description="You have unanswered questions. Once submitted, you cannot change your answers."
            type="warning"
            showIcon
          />
        )}
      </Modal>
    </div>
  );
};

export default TestTaker;
