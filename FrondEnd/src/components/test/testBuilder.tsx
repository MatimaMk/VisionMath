import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Card,
  Divider,
  Collapse,
  message,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useTestAction, useTestState } from "@/provider/test-provider";
import {
  CreateTestDto,
  UpdateTestDto,
  UpdateQuestionDto,
  UpdateQuestionOptionDto,
} from "@/provider/test-provider/context";
import { difficultLevel } from "@/enums/difficultLevel";
import { questionTypes } from "@/enums/questionTypes";
import styles from "./styles/testBuilder.module.css";

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Title } = Typography;

interface TestBuilderProps {
  testId?: string;
}

const TestBuilder: React.FC<TestBuilderProps> = ({ testId }) => {
  const [form] = Form.useForm();
  const { createTest, updateTest, getTestWithQuestions } = useTestAction();
  const { isPending, isSuccess, test } = useTestState();

  const [questions, setQuestions] = useState<UpdateQuestionDto[]>([]);

  useEffect(() => {
    if (testId) {
      getTestWithQuestions(testId);
    }
  }, [testId, getTestWithQuestions]);

  useEffect(() => {
    if (test && testId) {
      form.setFieldsValue({
        title: test.title,
        description: test.description,
        timeLimitMinutes: test.timeLimitMinutes,
        difficultyLevel: test.difficultyLevel,
        passingPercentage: test.passingPercentage,
        instructions: test.instructions,
      });

      if (test.questions) {
        // Convert QuestionDto[] to UpdateQuestionDto[]
        const updateQuestions: UpdateQuestionDto[] = test.questions.map(
          (q) => ({
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            questionPoints: q.questionPoints,
            solutionExplanation: q.solutionExplanation,
            questionOptions:
              q.questionOptions?.map((o) => ({
                id: o.id,
                optionText: o.optionText,
                isCorrect: o.isCorrect,
                orderNumber: o.orderNumber,
                explanation: o.explanation,
              })) || [],
          })
        );
        setQuestions(updateQuestions);
      }
    }
  }, [test, testId, form]);

  useEffect(() => {
    if (isSuccess) {
      message.success(
        testId ? "Test updated successfully!" : "Test created successfully!"
      );
    }
  }, [isSuccess, testId]);

  const handleSubmit = async (values: {
    title: string;
    description: string;
    timeLimitMinutes: number;
    difficultyLevel: difficultLevel;
    passingPercentage: number;
    instructions: string;
  }) => {
    try {
      if (testId) {
        // Update existing test
        const updateDto: UpdateTestDto = {
          id: testId,
          ...values,
          questions,
        };
        await updateTest(updateDto);
      } else {
        // Create new test
        const createDto: CreateTestDto = {
          ...values,
          questions: questions.map((q) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            questionPoints: q.questionPoints,
            solutionExplanation: q.solutionExplanation,
            questionOptions: q.questionOptions.map((o) => ({
              optionText: o.optionText,
              isCorrect: o.isCorrect,
              orderNumber: o.orderNumber,
              explanation: o.explanation,
            })),
          })),
        };
        await createTest(createDto);
      }
    } catch (error) {
      message.error("Failed to save test. Please try again." + error);
    }
  };

  const addQuestion = () => {
    const newQuestion: UpdateQuestionDto = {
      questionText: "",
      questionType: questionTypes.MultipleChoice,
      questionPoints: 1,
      solutionExplanation: "",
      questionOptions: [
        {
          optionText: "",
          isCorrect: true,
          orderNumber: 1,
        },
        {
          optionText: "",
          isCorrect: false,
          orderNumber: 2,
        },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const updateQuestion = (
    index: number,
    field: keyof UpdateQuestionDto,
    value: string | questionTypes | number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    // If question type changed, reset options appropriately
    if (field === "questionType") {
      if (value === questionTypes.TrueFalse) {
        updatedQuestions[index].questionOptions = [
          {
            optionText: "True",
            isCorrect: true,
            orderNumber: 1,
          },
          {
            optionText: "False",
            isCorrect: false,
            orderNumber: 2,
          },
        ];
      } else if (value === questionTypes.Numeric) {
        updatedQuestions[index].questionOptions = [
          {
            optionText: "",
            isCorrect: true,
            orderNumber: 1,
          },
        ];
      }
    }

    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const currentOptions =
      updatedQuestions[questionIndex].questionOptions || [];
    const newOption: UpdateQuestionOptionDto = {
      id: "00000000-0000-0000-0000-000000000000",
      optionText: "",
      isCorrect: false,
      orderNumber: currentOptions.length + 1,
    };

    updatedQuestions[questionIndex].questionOptions = [
      ...currentOptions,
      newOption,
    ];
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: keyof UpdateQuestionOptionDto,
    value: string | boolean | number
  ) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].questionOptions) {
      updatedQuestions[questionIndex].questionOptions = [];
    }

    const options = [...updatedQuestions[questionIndex].questionOptions];
    options[optionIndex] = {
      ...options[optionIndex],
      [field]: value,
    };

    // For single correct answer questions, ensure only one option is correct
    if (field === "isCorrect" && value === true) {
      const questionType = updatedQuestions[questionIndex].questionType;
      if (
        questionType === questionTypes.MultipleChoice ||
        questionType === questionTypes.TrueFalse
      ) {
        options.forEach((option, idx) => {
          if (idx !== optionIndex) {
            option.isCorrect = false;
          }
        });
      }
    }

    updatedQuestions[questionIndex].questionOptions = options;
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionOptions!.splice(optionIndex, 1);

    // Update order numbers
    updatedQuestions[questionIndex].questionOptions!.forEach((option, idx) => {
      option.orderNumber = idx + 1;
    });

    setQuestions(updatedQuestions);
  };

  return (
    <div className={styles.testBuilder}>
      <Card className={styles.formCard}>
        <Title level={2}>{testId ? "Edit Test" : "Create New Test"}</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficultyLevel: difficultLevel.Medium,
            passingPercentage: 70,
          }}
        >
          <Form.Item
            name="title"
            label="Test Title"
            rules={[{ required: true, message: "Please enter a test title" }]}
          >
            <Input placeholder="Enter test title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter test description" />
          </Form.Item>

          <div className={styles.formRow}>
            <Form.Item
              name="timeLimitMinutes"
              label="Time Limit (minutes)"
              className={styles.formColumn}
            >
              <InputNumber min={1} max={180} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="difficultyLevel"
              label="Difficulty Level"
              className={styles.formColumn}
            >
              <Select style={{ width: "100%" }}>
                <Option value={difficultLevel.Easy}>Easy</Option>
                <Option value={difficultLevel.Medium}>Medium</Option>
                <Option value={difficultLevel.Difficult}>Difficult</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="passingPercentage"
              label="Passing Percentage"
              className={styles.formColumn}
            >
              <InputNumber min={1} max={100} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item name="instructions" label="Test Instructions">
            <TextArea
              rows={4}
              placeholder="Enter instructions for test takers"
            />
          </Form.Item>

          <Divider>Questions</Divider>

          {questions.length === 0 && (
            <div className={styles.emptyQuestions}>
              <p>
                No questions added yet. Click the button below to add questions.
              </p>
            </div>
          )}

          <Collapse className={styles.questionsCollapse}>
            {questions.map((question, qIndex) => (
              <Panel
                header={question.questionText || `Question ${qIndex + 1}`}
                key={qIndex}
                extra={
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(qIndex);
                    }}
                  />
                }
              >
                <div className={styles.questionForm}>
                  <div className={styles.questionHeader}>
                    <div className={styles.questionText}>
                      <label>Question Text</label>
                      <TextArea
                        rows={2}
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(qIndex, "questionText", e.target.value)
                        }
                        placeholder="Enter question text"
                      />
                    </div>

                    <div className={styles.questionMeta}>
                      <div>
                        <label>Type</label>
                        <Select
                          value={question.questionType}
                          onChange={(value) =>
                            updateQuestion(qIndex, "questionType", value)
                          }
                          style={{ width: "100%" }}
                        >
                          <Option value={questionTypes.MultipleChoice}>
                            Multiple Choice
                          </Option>
                          <Option value={questionTypes.TrueFalse}>
                            True/False
                          </Option>
                          <Option value={questionTypes.Numeric}>
                            Short Answer
                          </Option>
                        </Select>
                      </div>

                      <div>
                        <label>Points</label>
                        <InputNumber
                          min={1}
                          value={question.questionPoints}
                          onChange={(value) =>
                            updateQuestion(qIndex, "questionPoints", value || 1)
                          }
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {question.questionType !== questionTypes.Numeric && (
                    <div className={styles.optionsContainer}>
                      <label>Options</label>
                      {question.questionOptions?.map((option, oIndex) => (
                        <div key={oIndex} className={styles.optionRow}>
                          <Input
                            value={option.optionText}
                            onChange={(e) =>
                              updateOption(
                                qIndex,
                                oIndex,
                                "optionText",
                                e.target.value
                              )
                            }
                            placeholder={`Option ${oIndex + 1}`}
                            className={styles.optionInput}
                          />

                          <Select
                            value={option.isCorrect}
                            onChange={(value) =>
                              updateOption(qIndex, oIndex, "isCorrect", value)
                            }
                            className={styles.correctSelect}
                          >
                            <Option value={true}>Correct</Option>
                            <Option value={false}>Incorrect</Option>
                          </Select>

                          {question.questionType ===
                            questionTypes.MultipleChoice &&
                            (question.questionOptions?.length || 0) > 2 && (
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeOption(qIndex, oIndex)}
                              />
                            )}
                        </div>
                      ))}

                      {question.questionType ===
                        questionTypes.MultipleChoice && (
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={() => addOption(qIndex)}
                          className={styles.addOptionBtn}
                        >
                          Add Option
                        </Button>
                      )}
                    </div>
                  )}

                  <div className={styles.explanationField}>
                    <label>Solution Explanation</label>
                    <TextArea
                      rows={2}
                      value={question.solutionExplanation}
                      onChange={(e) =>
                        updateQuestion(
                          qIndex,
                          "solutionExplanation",
                          e.target.value
                        )
                      }
                      placeholder="Explain the correct answer (shown after test)"
                    />
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>

          <div className={styles.actionButtons}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addQuestion}
              className={styles.addQuestionBtn}
            >
              Add Question
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isPending}
              className={styles.submitBtn}
            >
              {testId ? "Update Test" : "Create Test"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TestBuilder;
