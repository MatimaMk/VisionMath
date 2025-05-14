"use client";

import { useState } from "react";
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
  Empty,
  Collapse,
  Switch,
  Radio,
  RadioChangeEvent,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { CreateQuestionDto } from "@/provider/test-provider/context";
import { questionTypes } from "@/enums/questionTypes";
import styles from "./styles/questionForm.module.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface QuestionFormProps {
  questions: CreateQuestionDto[];
  onChange: (questions: CreateQuestionDto[]) => void;
}
const QuestionForm = ({ questions, onChange }: QuestionFormProps) => {
  const [form] = Form.useForm<CreateQuestionDto>();
  const [editingQuestion, setEditingQuestion] =
    useState<CreateQuestionDto | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<questionTypes>(
    questionTypes.MultipleChoice
  );

  const handleAddQuestion = () => {
    form.validateFields().then((values: CreateQuestionDto) => {
      const processedValues = { ...values };

      if (values.questionType === questionTypes.TrueFalse) {
        // Ensure the True/False options have proper text values
        processedValues.questionOptions = values.questionOptions.map(
          (option, index) => ({
            ...option,
            optionText: index === 0 ? "True" : "False",
            orderNumber: index,
          })
        );
      }

      // For fill in the blank and numeric, ensure there's at least one option for the correct answer
      if (
        values.questionType === questionTypes.FillInTheBlank ||
        values.questionType === questionTypes.Numeric
      ) {
        if (
          !processedValues.questionOptions ||
          processedValues.questionOptions.length === 0
        ) {
          // Create a default option with the entered text
          processedValues.questionOptions = [
            {
              optionText: values.questionOptions?.[0]?.optionText || "",
              isCorrect: true,
              orderNumber: 0,
            },
          ];
        }
      }

      const newQuestion: CreateQuestionDto = {
        questionText: processedValues.questionText,
        questionType: processedValues.questionType,
        questionPoints: processedValues.questionPoints,
        solutionExplanation: processedValues.solutionExplanation,
        questionOptions: processedValues.questionOptions || [],
      };

      let updatedQuestions: CreateQuestionDto[];

      if (editingIndex !== null) {
        // Update existing question
        updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = newQuestion;
      } else {
        // Add new question
        updatedQuestions = [...questions, newQuestion];
      }

      onChange(updatedQuestions);

      // Reset form and state
      form.resetFields();
      setEditingQuestion(null);
      setEditingIndex(null);
      setQuestionType(questionTypes.MultipleChoice);
    });
  };

  const handleEditQuestion = (question: CreateQuestionDto, index: number) => {
    setEditingQuestion(question);
    setEditingIndex(index);
    setQuestionType(question.questionType);

    // Set form values
    form.setFieldsValue({
      ...question,
    });
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onChange(updatedQuestions);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingQuestion(null);
    setEditingIndex(null);
  };

  const handleTypeChange = (value: questionTypes) => {
    setQuestionType(value);

    // Reset the options when changing question type
    const currentValues = form.getFieldsValue();

    // Initialize with appropriate default options based on question type
    if (value === questionTypes.TrueFalse) {
      form.setFieldsValue({
        ...currentValues,
        questionOptions: [
          { optionText: "True", isCorrect: false, orderNumber: 0 },
          { optionText: "False", isCorrect: false, orderNumber: 1 },
        ],
      });
    } else if (
      value === questionTypes.FillInTheBlank ||
      value === questionTypes.Numeric
    ) {
      form.setFieldsValue({
        ...currentValues,
        questionOptions: [{ optionText: "", isCorrect: true, orderNumber: 0 }],
      });
    } else {
      // Multiple choice - start with one empty option
      form.setFieldsValue({
        ...currentValues,
        questionOptions: [{ optionText: "", isCorrect: false, orderNumber: 0 }],
      });
    }
  };

  const renderOptionFields = () => {
    if (questionType === questionTypes.FillInTheBlank) {
      return (
        <Form.Item
          name={["questionOptions", 0, "optionText"]}
          rules={[
            { required: true, message: "Please enter the correct answer" },
          ]}
          label="Correct Answer"
        >
          <Input placeholder="Enter the correct answer" />
        </Form.Item>
      );
    } else if (questionType === questionTypes.Numeric) {
      return (
        <Form.Item
          name={["questionOptions", 0, "optionText"]}
          rules={[
            {
              required: true,
              message: "Please enter the correct numeric answer",
            },
          ]}
          label="Correct Numeric Answer"
        >
          <Input type="number" placeholder="Enter the correct numeric answer" />
        </Form.Item>
      );
    } else if (questionType === questionTypes.TrueFalse) {
      return (
        <Form.List
          name="questionOptions"
          initialValue={[
            { optionText: "True", isCorrect: false, orderNumber: 0 },
            { optionText: "False", isCorrect: false, orderNumber: 1 },
          ]}
        >
          {(fields) => (
            <>
              <Form.Item label="Correct Answer">
                <Radio.Group
                  onChange={(e: RadioChangeEvent) => {
                    // Use type assertion but make it safer
                    const options = form.getFieldValue("questionOptions");
                    if (Array.isArray(options)) {
                      options.forEach((option, index) => {
                        if (option && typeof option === "object") {
                          option.isCorrect = index === e.target.value;
                          // Ensure optionText is set correctly
                          option.optionText = index === 0 ? "True" : "False";
                        }
                      });
                      form.setFieldsValue({ questionOptions: options });
                    }
                  }}
                >
                  <Radio value={0}>True</Radio>
                  <Radio value={1}>False</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Hidden form items to ensure optionText is included in form data */}
              {fields.map((field) => (
                <Form.Item
                  key={field.key}
                  name={[field.name, "optionText"]}
                  initialValue={field.name === 0 ? "True" : "False"}
                  hidden
                />
              ))}
            </>
          )}
        </Form.List>
      );
    } else {
      // Multiple choice
      return (
        <Form.List
          name="questionOptions"
          initialValue={[{ optionText: "", isCorrect: false, orderNumber: 0 }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} className={styles.optionRow}>
                  <Form.Item
                    {...field}
                    name={[field.name, "optionText"]}
                    rules={[
                      { required: true, message: "Option text is required" },
                    ]}
                    className={styles.optionTextInput}
                  >
                    <Input placeholder={`Option ${index + 1}`} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "isCorrect"]}
                    valuePropName="checked"
                    className={styles.optionCorrectSwitch}
                  >
                    <Switch
                      checkedChildren={<CheckCircleOutlined />}
                      unCheckedChildren={<CloseCircleOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "orderNumber"]}
                    initialValue={index}
                    hidden
                  />

                  <Form.Item>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                      disabled={fields.length === 1}
                    />
                  </Form.Item>
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      optionText: "",
                      isCorrect: false,
                      orderNumber: fields.length,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add Option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      );
    }
  };

  const renderQuestionForm = () => (
    <Card className={styles.questionFormCard}>
      <Title level={5}>
        {editingQuestion ? "Edit Question" : "Add New Question"}
      </Title>
      <Form form={form} layout="vertical" onFinish={handleAddQuestion}>
        <Form.Item
          name="questionText"
          label="Question Text"
          rules={[
            { required: true, message: "Please enter the question text" },
          ]}
        >
          <TextArea
            placeholder="Enter your question"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <div className={styles.formRow}>
          <Form.Item
            name="questionType"
            label="Question Type"
            rules={[
              { required: true, message: "Please select a question type" },
            ]}
            initialValue={questionTypes.MultipleChoice}
            className={styles.formHalfWidth}
          >
            <Select
              placeholder="Select question type"
              onChange={handleTypeChange}
              options={[
                {
                  value: questionTypes.MultipleChoice,
                  label: "Multiple Choice",
                },
                { value: questionTypes.TrueFalse, label: "True/False" },
                {
                  value: questionTypes.FillInTheBlank,
                  label: "Fill in the Blank",
                },
                { value: questionTypes.Numeric, label: "Numeric" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="questionPoints"
            label="Points"
            rules={[
              {
                required: true,
                message: "Please assign points to this question",
              },
            ]}
            initialValue={1}
            className={styles.formHalfWidth}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Divider orientation="left">Options</Divider>

        {renderOptionFields()}

        <Form.Item
          name="solutionExplanation"
          label="Solution Explanation"
          rules={[
            {
              required: true,
              message: "Please provide a solution explanation",
            },
          ]}
        >
          <TextArea
            placeholder="Explain the solution or correct answer"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingQuestion ? "Update Question" : "Add Question"}
            </Button>
            {editingQuestion && <Button onClick={handleCancel}>Cancel</Button>}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderQuestionsList = () => (
    <div className={styles.questionsList}>
      <div className={styles.questionsHeader}>
        <Title level={5}>Questions ({questions.length})</Title>
      </div>

      {questions.length === 0 ? (
        <Empty description="No questions added yet" />
      ) : (
        <Collapse accordion className={styles.questionsCollapse}>
          {questions.map((question, index) => (
            <Panel
              key={index}
              header={
                <div className={styles.questionHeader}>
                  <span>Question {index + 1}:</span>
                  <Text strong>{question.questionText}</Text>
                </div>
              }
              extra={
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditQuestion(question, index);
                    }}
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(index);
                    }}
                  />
                </Space>
              }
            >
              <div className={styles.questionDetails}>
                <div className={styles.questionInfo}>
                  <Text type="secondary">
                    Type: {questionTypes[question.questionType]}
                  </Text>
                  <Text type="secondary">
                    Points: {question.questionPoints}
                  </Text>
                </div>

                <Divider orientation="left" plain>
                  Options
                </Divider>

                {question.questionType === questionTypes.FillInTheBlank ||
                question.questionType === questionTypes.Numeric ? (
                  <div className={styles.optionItem}>
                    <Text strong>Correct Answer:</Text>
                    <Text>{question.questionOptions[0]?.optionText}</Text>
                  </div>
                ) : (
                  <div className={styles.optionsList}>
                    {question.questionOptions.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`${styles.optionItem} ${
                          option.isCorrect ? styles.correctOption : ""
                        }`}
                      >
                        <Text mark={option.isCorrect}>
                          {option.isCorrect && <CheckCircleOutlined />}{" "}
                          {option.optionText}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}

                <Divider orientation="left" plain>
                  Explanation
                </Divider>
                <Text>{question.solutionExplanation}</Text>
              </div>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );

  return (
    <div className={styles.questionFormContainer}>
      {renderQuestionForm()}
      <Divider />
      {renderQuestionsList()}
    </div>
  );
};

export default QuestionForm;
