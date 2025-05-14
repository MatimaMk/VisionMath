"use client";

import { useState } from "react";
import {
  Card,
  Typography,
  Progress,
  Button,
  Divider,
  Tag,
  Collapse,
  Row,
  Col,
  Statistic,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  TestWithQuestionsDto,
  QuestionDto,
  SubmitTestResultDto,
  SubmitAnswerDto,
} from "@/provider/test-provider/context";
import { questionTypes } from "@/enums/questionTypes";
import { difficultLevel } from "@/enums/difficultLevel";
import styles from "./TestResults.module.css";
import Link from "next/link";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface TestResultsProps {
  test: TestWithQuestionsDto;
  result: SubmitTestResultDto;
  answers: SubmitAnswerDto[];
  userRole: "educator" | "student";
  onRetakeTest?: () => void;
}

const TestResults = ({
  test,
  result,
  answers,
  userRole,
  onRetakeTest,
}: TestResultsProps) => {
  const [showAllExplanations, setShowAllExplanations] = useState(false);

  // Calculate test statistics
  const totalQuestions = test.questions.length;
  const correctAnswers = answers.filter(
    (a) =>
      test.questions
        .find((q) => q.id === a.questionId)
        ?.questionOptions?.find((o) => o.id === a.selectedOptionId)?.isCorrect
  ).length;

  const getDifficultyTag = (level: difficultLevel) => {
    const colors = ["green", "blue", "orange"];
    const texts = ["Easy", "Medium", "Hard"];

    return <Tag color={colors[level]}>{texts[level]}</Tag>;
  };

  const renderTestSummary = () => (
    <Card className={styles.summaryCard}>
      <div className={styles.resultHeader}>
        <Title level={3}>Test Results</Title>
        <div className={styles.resultStatus}>
          {result.passed ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              PASSED
            </Tag>
          ) : (
            <Tag color="error" icon={<CloseCircleOutlined />}>
              FAILED
            </Tag>
          )}
        </div>
      </div>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className={styles.scoreCard}>
            <Statistic
              title="Your Score"
              value={result.percentage}
              suffix="%"
              precision={1}
              valueStyle={{ color: result.passed ? "#3f8600" : "#cf1322" }}
            />
            <Progress
              percent={result.percentage}
              status={result.passed ? "success" : "exception"}
              strokeColor={result.passed ? "#3f8600" : "#cf1322"}
            />
            <div className={styles.passingScoreInfo}>
              <Text type="secondary">
                Passing Score: {test.passingPercentage}%
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="Points Earned"
                value={result.earnedPoints}
                suffix={`/ ${result.totalPoints}`}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Correct Answers"
                value={correctAnswers}
                suffix={`/ ${totalQuestions}`}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Time Allowed"
                value={test.timeLimitMinutes}
                suffix="min"
              />
            </Col>
            <Col span={12}>
              <div className={styles.difficultyInfo}>
                <Text>Difficulty:</Text>
                {getDifficultyTag(test.difficultyLevel)}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className={styles.actionsRow}>
        {userRole === "student" && onRetakeTest && (
          <Button type="primary" icon={<RedoOutlined />} onClick={onRetakeTest}>
            Retake Test
          </Button>
        )}

        <Link
          href={
            userRole === "student"
              ? "/dashboard/educator/tests"
              : "/dashboard/student/tests"
          }
        >
          <Button icon={<HomeOutlined />}>
            {userRole === "educator" ? "Back to Tests" : "All Tests"}
          </Button>
        </Link>

        <Button
          type="link"
          onClick={() => setShowAllExplanations(!showAllExplanations)}
        >
          {showAllExplanations
            ? "Hide All Explanations"
            : "Show All Explanations"}
        </Button>
      </div>
    </Card>
  );

  const getAnswerStatus = (
    question: QuestionDto,
    answer: SubmitAnswerDto | undefined
  ) => {
    if (!answer) return "unanswered";

    if (
      question.questionType === questionTypes.MultipleChoice ||
      question.questionType === questionTypes.TrueFalse
    ) {
      const selectedOption = question.questionOptions?.find(
        (o) => o.id === answer.selectedOptionId
      );
      return selectedOption?.isCorrect ? "correct" : "incorrect";
    } else if (question.questionType === questionTypes.FillInTheBlank) {
      const correctOption = question.questionOptions?.find((o) => o.isCorrect);
      return correctOption?.optionText?.toLowerCase() ===
        answer.textAnswer?.toLowerCase()
        ? "correct"
        : "incorrect";
    } else if (question.questionType === questionTypes.Numeric) {
      const correctOption = question.questionOptions?.find((o) => o.isCorrect);
      return correctOption?.optionText === answer.numericAnswer?.toString()
        ? "correct"
        : "incorrect";
    }

    return "unanswered";
  };

  const renderAnswerDetails = (
    question: QuestionDto,
    answer: SubmitAnswerDto | undefined
  ) => {
    const status = getAnswerStatus(question, answer);

    if (!answer) {
      return (
        <Alert
          message="This question was not answered"
          type="warning"
          showIcon
        />
      );
    }

    if (
      question.questionType === questionTypes.MultipleChoice ||
      question.questionType === questionTypes.TrueFalse
    ) {
      const selectedOption = question.questionOptions?.find(
        (o) => o.id === answer.selectedOptionId
      );
      const correctOption = question.questionOptions?.find((o) => o.isCorrect);

      return (
        <div className={styles.answerDetails}>
          <div className={styles.answerDetail}>
            <Text strong>Your Answer:</Text>
            <Text
              type={status === "correct" ? "success" : "danger"}
              className={styles.answerText}
            >
              {status === "correct" ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )}
              {selectedOption?.optionText}
            </Text>
          </div>

          {status === "incorrect" && (
            <div className={styles.answerDetail}>
              <Text strong>Correct Answer:</Text>
              <Text type="success" className={styles.answerText}>
                <CheckCircleOutlined /> {correctOption?.optionText}
              </Text>
            </div>
          )}
        </div>
      );
    } else if (question.questionType === questionTypes.FillInTheBlank) {
      const correctOption = question.questionOptions?.find((o) => o.isCorrect);

      return (
        <div className={styles.answerDetails}>
          <div className={styles.answerDetail}>
            <Text strong>Your Answer:</Text>
            <Text
              type={status === "correct" ? "success" : "danger"}
              className={styles.answerText}
            >
              {status === "correct" ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )}
              {answer.textAnswer}
            </Text>
          </div>

          {status === "incorrect" && (
            <div className={styles.answerDetail}>
              <Text strong>Correct Answer:</Text>
              <Text type="success" className={styles.answerText}>
                <CheckCircleOutlined /> {correctOption?.optionText}
              </Text>
            </div>
          )}
        </div>
      );
    } else if (question.questionType === questionTypes.Numeric) {
      const correctOption = question.questionOptions?.find((o) => o.isCorrect);

      return (
        <div className={styles.answerDetails}>
          <div className={styles.answerDetail}>
            <Text strong>Your Answer:</Text>
            <Text
              type={status === "correct" ? "success" : "danger"}
              className={styles.answerText}
            >
              {status === "correct" ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )}
              {answer.numericAnswer}
            </Text>
          </div>

          {status === "incorrect" && (
            <div className={styles.answerDetail}>
              <Text strong>Correct Answer:</Text>
              <Text type="success" className={styles.answerText}>
                <CheckCircleOutlined /> {correctOption?.optionText}
              </Text>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderQuestionDetails = () => (
    <Card className={styles.questionDetailsCard}>
      <Title level={4}>Question Details</Title>

      <Collapse
        accordion={!showAllExplanations}
        bordered={false}
        className={styles.questionsCollapse}
        expandIconPosition="right"
        defaultActiveKey={
          showAllExplanations ? test.questions.map((_, i) => i.toString()) : []
        }
      >
        {test.questions.map((question, index) => {
          const answer = answers.find((a) => a.questionId === question.id);
          const status = getAnswerStatus(question, answer);

          return (
            <Panel
              key={index.toString()}
              header={
                <div className={styles.questionHeader}>
                  <span
                    className={`${styles.questionStatus} ${styles[status]}`}
                  >
                    {status === "correct" ? (
                      <CheckCircleOutlined />
                    ) : status === "incorrect" ? (
                      <CloseCircleOutlined />
                    ) : (
                      <QuestionCircleOutlined />
                    )}
                  </span>
                  <Text strong>{`Question ${index + 1}: `}</Text>
                  <Text>{question.questionText}</Text>
                </div>
              }
              className={styles.questionPanel}
            >
              <div className={styles.questionDetails}>
                <div className={styles.questionInfo}>
                  <Tag>{questionTypes[question.questionType]}</Tag>
                  <Tag>Points: {question.questionPoints}</Tag>
                </div>

                <Divider orientation="left">Your Response</Divider>

                {renderAnswerDetails(question, answer)}

                <Divider orientation="left">Explanation</Divider>

                <Alert
                  message="Solution Explanation"
                  description={question.solutionExplanation}
                  type="info"
                  showIcon
                  icon={<FileTextOutlined />}
                />
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );

  return (
    <div className={styles.testResultsContainer}>
      {renderTestSummary()}
      {renderQuestionDetails()}
    </div>
  );
};

export default TestResults;
