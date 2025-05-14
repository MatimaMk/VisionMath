"use client";

import { useState } from "react";
import {
  Card,
  Typography,
  Tabs,
  Descriptions,
  Tag,
  Divider,
  Collapse,
  List,
  Space,
} from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  TestWithQuestionsDto,
  QuestionDto,
} from "@/provider/test-provider/context";
import { difficultLevel } from "@/enums/difficultLevel";
import { questionTypes } from "@/enums/questionTypes";
import styles from "./styles/testPreview.module.css";

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface TestPreviewProps {
  test: TestWithQuestionsDto;
  isPreview?: boolean;
}

const TestPreview = ({ test, isPreview = false }: TestPreviewProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getDifficultyTag = (level: difficultLevel) => {
    const colors = ["green", "blue", "orange", "red"];
    const texts = ["Easy", "Medium", "Hard", "Expert"];

    return <Tag color={colors[level]}>{texts[level]}</Tag>;
  };

  const renderQuestionTypeTag = (type: questionTypes) => {
    const colors = ["blue", "green", "orange", "purple"];
    const texts = [
      "Multiple Choice",
      "True/False",
      "Fill in the Blank",
      "Numeric",
    ];

    return <Tag color={colors[type]}>{texts[type]}</Tag>;
  };

  const renderOverviewTab = () => (
    <div className={styles.overviewTab}>
      <Descriptions
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Title" span={2}>
          {test.title}
        </Descriptions.Item>
        <Descriptions.Item label="Difficulty">
          {getDifficultyTag(test.difficultyLevel)}
        </Descriptions.Item>
        <Descriptions.Item label="Time Limit">
          <Space>
            <ClockCircleOutlined />
            {test.timeLimitMinutes} minutes
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={4}>
          {test.description}
        </Descriptions.Item>
        <Descriptions.Item label="Instructions" span={4}>
          {test.instructions}
        </Descriptions.Item>
        <Descriptions.Item label="Passing Percentage">
          <Tag color="green">{test.passingPercentage}%</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Questions Count">
          <Tag color="blue">{test.questions.length}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Total Points">
          {test.questions.reduce((total, q) => total + q.questionPoints, 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Max Attempts">
          {test.attempts || "Unlimited"}
        </Descriptions.Item>
      </Descriptions>

      {test.creationTime && (
        <div className={styles.creationTime}>
          <Text type="secondary">
            Created: {new Date(test.creationTime).toLocaleString()}
          </Text>
        </div>
      )}
    </div>
  );

  const renderQuestionsTab = () => (
    <div className={styles.questionsTab}>
      <Collapse
        accordion={!isPreview}
        defaultActiveKey={isPreview ? undefined : ["0"]}
      >
        {test.questions.map((question, index) => (
          <Panel
            key={index.toString()}
            header={
              <div className={styles.questionHeader}>
                <Text strong>Question {index + 1}:</Text>
                <Text className={styles.questionText}>
                  {question.questionText}
                </Text>
                <div className={styles.questionMeta}>
                  {renderQuestionTypeTag(question.questionType)}
                  <Tag color="purple">Points: {question.questionPoints}</Tag>
                </div>
              </div>
            }
          >
            <div className={styles.questionDetails}>
              {!isPreview && renderQuestionOptions(question)}

              {!isPreview && (
                <>
                  <Divider orientation="left">Explanation</Divider>
                  <Paragraph>{question.solutionExplanation}</Paragraph>
                </>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );

  const renderQuestionOptions = (question: QuestionDto) => {
    if (!question.questionOptions || question.questionOptions.length === 0) {
      return <Text type="secondary">No options provided</Text>;
    }

    if (
      question.questionType === questionTypes.FillInTheBlank ||
      question.questionType === questionTypes.Numeric
    ) {
      const correctOption = question.questionOptions.find((o) => o.isCorrect);

      return (
        <>
          <Divider orientation="left">Correct Answer</Divider>
          <Text strong>{correctOption?.optionText}</Text>
          {correctOption?.explanation && (
            <Paragraph type="secondary" className={styles.optionExplanation}>
              {correctOption.explanation}
            </Paragraph>
          )}
        </>
      );
    }

    return (
      <>
        <Divider orientation="left">Options</Divider>
        <List
          dataSource={question.questionOptions}
          renderItem={(option, index) => (
            <List.Item className={styles.optionItem}>
              <div className={styles.optionContent}>
                <div className={styles.optionHeader}>
                  <Space>
                    <Text>{String.fromCharCode(65 + index)}.</Text>
                    <Text strong={option.isCorrect}>{option.optionText}</Text>
                    {option.isCorrect && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        Correct
                      </Tag>
                    )}
                  </Space>
                </div>
                {option.explanation && (
                  <Paragraph
                    type="secondary"
                    className={styles.optionExplanation}
                  >
                    {option.explanation}
                  </Paragraph>
                )}
              </div>
            </List.Item>
          )}
        />
      </>
    );
  };

  const renderTabContent = () => {
    const items = [
      {
        key: "overview",
        label: "Overview",
        children: renderOverviewTab(),
      },
      {
        key: "questions",
        label: `Questions (${test.questions.length})`,
        children: renderQuestionsTab(),
      },
    ];

    return (
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        type="card"
      />
    );
  };

  return <Card className={styles.testPreviewCard}>{renderTabContent()}</Card>;
};

export default TestPreview;
