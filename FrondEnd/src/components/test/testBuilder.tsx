"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Card,
  Typography,
  Divider,
  Space,
  Steps,
  message,
} from "antd";
import { SaveOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  CreateTestDto,
  CreateQuestionDto,
  TestDetailsFormValues,
} from "@/provider/test-provider/context";
import { difficultLevel } from "@/enums/difficultLevel";
import { questionTypes } from "@/enums/questionTypes";
import QuestionForm from "./questionForm";
import styles from "./styles/testBuilder.module.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface TestFormProps {
  initialValues?: Partial<CreateTestDto>;
  onSubmit: (values: CreateTestDto) => Promise<void>;
  isSubmitting: boolean;
}

const TestForm = ({ initialValues, onSubmit, isSubmitting }: TestFormProps) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [testData, setTestData] = useState<Partial<CreateTestDto>>(
    initialValues || {}
  );
  const [questions, setQuestions] = useState<CreateQuestionDto[]>(
    initialValues?.questions || []
  );

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setTestData(initialValues);
      setQuestions(initialValues.questions || []);
    }
  }, [initialValues, form]);

  const steps = [
    {
      title: "Test Details",
      content: "test-details",
    },
    {
      title: "Questions",
      content: "questions",
    },
    {
      title: "Review",
      content: "review",
    },
  ];

  const handleTestDetailsSubmit = (values: TestDetailsFormValues) => {
    setTestData(values);
    setCurrentStep(1);
  };

  const handleQuestionsUpdate = (updatedQuestions: CreateQuestionDto[]) => {
    setQuestions(updatedQuestions);
  };

  const handleFinalSubmit = async () => {
    try {
      // Combine test data with questions
      const finalData: CreateTestDto = {
        ...(testData as CreateTestDto),
        questions: questions,
      };

      await onSubmit(finalData);
      message.success("Test created successfully!");
    } catch (error) {
      message.error("Failed to create test");
      console.error("Error creating test:", error);
    }
  };

  const renderTestDetailsForm = () => (
    <Card className={styles.formCard}>
      <Title level={4}>Test Details</Title>
      <Text type="secondary">
        Please fill in the basic information about this test.
      </Text>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        initialValues={testData}
        onFinish={handleTestDetailsSubmit}
      >
        <Form.Item
          name="title"
          label="Test Title"
          rules={[{ required: true, message: "Please enter the test title" }]}
        >
          <Input placeholder="Enter test title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <TextArea
            placeholder="Enter test description"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <div className={styles.formRow}>
          <Form.Item
            name="timeLimitMinutes"
            label="Time Limit (minutes)"
            rules={[{ required: true, message: "Please set a time limit" }]}
            className={styles.halfWidth}
          >
            <Input type="number" min={1} placeholder="e.g., 60" />
          </Form.Item>

          <Form.Item
            name="difficultyLevel"
            label="Difficulty Level"
            rules={[{ required: true, message: "Please select difficulty" }]}
            className={styles.halfWidth}
          >
            <Select placeholder="Select difficulty level">
              <Option value={difficultLevel.Easy}>Easy</Option>
              <Option value={difficultLevel.Medium}>Medium</Option>
              <Option value={difficultLevel.Difficult}>Hard</Option>
            </Select>
          </Form.Item>
        </div>

        <div className={styles.formRow}>
          <Form.Item
            name="passingPercentage"
            label="Passing Percentage"
            rules={[
              { required: true, message: "Please set passing percentage" },
            ]}
            className={styles.halfWidth}
          >
            <InputNumber
              min={1}
              max={100}
              formatter={(value) => `${value}%`}
              // parser={(value) => (value ? value.replace("%", "") : "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="attempts"
            label="Allowed Attempts"
            className={styles.halfWidth}
          >
            <InputNumber
              min={1}
              placeholder="e.g., 3 (unlimited if blank)"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="instructions"
          label="Instructions"
          rules={[{ required: true, message: "Please provide instructions" }]}
        >
          <TextArea
            placeholder="Instructions for test takers"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Next <RightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderQuestionsStep = () => (
    <Card className={styles.formCard}>
      <div className={styles.cardHeader}>
        <Title level={4}>Add Questions</Title>
        <Button
          type="primary"
          onClick={() => setCurrentStep(2)}
          disabled={questions.length === 0}
        >
          Next <RightOutlined />
        </Button>
      </div>
      <Text type="secondary">
        Add questions to your test. You need at least one question.
      </Text>
      <Divider />

      <QuestionForm questions={questions} onChange={handleQuestionsUpdate} />

      <div className={styles.stepNavigation}>
        <Button onClick={() => setCurrentStep(0)}>
          <LeftOutlined /> Back
        </Button>
      </div>
    </Card>
  );

  const renderReviewStep = () => (
    <Card className={styles.formCard}>
      <Title level={4}>Review Test</Title>
      <Text type="secondary">
        Review your test information before submitting.
      </Text>
      <Divider />

      <div className={styles.reviewSection}>
        <Title level={5}>Test Details</Title>
        <div className={styles.reviewItem}>
          <Text strong>Title:</Text> <Text>{testData.title}</Text>
        </div>
        <div className={styles.reviewItem}>
          <Text strong>Description:</Text> <Text>{testData.description}</Text>
        </div>
        <div className={styles.reviewItem}>
          <Text strong>Time Limit:</Text>{" "}
          <Text>{testData.timeLimitMinutes} minutes</Text>
        </div>
        <div className={styles.reviewItem}>
          <Text strong>Difficulty:</Text>{" "}
          <Text>
            {difficultLevel[testData.difficultyLevel as difficultLevel]}
          </Text>
        </div>
        <div className={styles.reviewItem}>
          <Text strong>Passing Percentage:</Text>{" "}
          <Text>{testData.passingPercentage}%</Text>
        </div>
        <div className={styles.reviewItem}>
          <Text strong>Questions:</Text> <Text>{questions.length}</Text>
        </div>

        <Title level={5} style={{ marginTop: 24 }}>
          Questions Overview
        </Title>
        {questions.map((question, index) => (
          <div key={index} className={styles.questionReviewItem}>
            <Text strong>Q{index + 1}:</Text>{" "}
            <Text>{question.questionText}</Text>
            <div className={styles.questionDetails}>
              <Text type="secondary">
                Type: {questionTypes[question.questionType]}
              </Text>
              <Text type="secondary">Points: {question.questionPoints}</Text>
              <Text type="secondary">
                Options: {question.questionOptions.length}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.stepNavigation}>
        <Space>
          <Button onClick={() => setCurrentStep(1)}>
            <LeftOutlined /> Back
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleFinalSubmit}
            loading={isSubmitting}
          >
            Submit Test
          </Button>
        </Space>
      </div>
    </Card>
  );

  return (
    <div className={styles.testFormContainer}>
      <Steps current={currentStep} items={steps} className={styles.steps} />

      <div className={styles.stepsContent}>
        {currentStep === 0 && renderTestDetailsForm()}
        {currentStep === 1 && renderQuestionsStep()}
        {currentStep === 2 && renderReviewStep()}
      </div>
    </div>
  );
};

export default TestForm;
