"use client";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Spin,
  message,
  Select,
  Card,
  Typography,
  Alert,
  Divider,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  HistoryOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface EducatorFormProps {
  initialValues?: Educator;
  onSubmit: (values: Educator) => Promise<void>;
  loading?: boolean;
}

interface Educator {
  id?: string;
  userId?: number;
  highestQualification: string;
  yearsOfMathTeaching: number;
  biography: string;
  students?: any[];
}

// List of qualifications for dropdown
const qualifications = [
  "Bachelor's in Education",
  "Bachelor's in Mathematics",
  "Master's in Education",
  "Master's in Mathematics",
  "PhD in Education",
  "PhD in Mathematics",
  "Teaching Certificate",
  "Other",
];

export default function EducatorForm({
  initialValues,
  onSubmit,
  loading = false,
}: EducatorFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [customQualification, setCustomQualification] = useState(false);

  // Initialize form with values if provided
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);

      // Check if we need to use "Other" option for qualification
      if (
        initialValues.highestQualification &&
        !qualifications.includes(initialValues.highestQualification)
      ) {
        form.setFieldsValue({ qualificationSelect: "Other" });
        form.setFieldsValue({
          qualificationCustom: initialValues.highestQualification,
        });
        setCustomQualification(true);
      } else {
        form.setFieldsValue({
          qualificationSelect: initialValues.highestQualification,
        });
      }
    }
  }, [initialValues, form]);

  const handleQualificationChange = (value: string) => {
    setCustomQualification(value === "Other");
    if (value !== "Other") {
      form.setFieldsValue({ highestQualification: value });
    }
  };

  const handleCustomQualificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.setFieldsValue({ highestQualification: e.target.value });
  };

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);

      // Handle qualification
      const educatorData: Educator = {
        ...values,
        highestQualification: values.highestQualification,
        // Ensure we have the original ID if editing
        ...(initialValues?.id && { id: initialValues.id }),
      };

      await onSubmit(educatorData);
      message.success(
        `Educator ${initialValues ? "updated" : "created"} successfully!`
      );
      if (!initialValues) {
        form.resetFields();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("An error occurred while saving. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading || submitting} tip="Processing...">
      <Card className="educator-form-card">
        <Title level={3}>
          {initialValues ? "Edit Educator Profile" : "Create Educator Profile"}
        </Title>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
          scrollToFirstError
        >
          {/* Highest Qualification */}
          <Form.Item
            label="Highest Qualification"
            required
            tooltip="Select your highest academic qualification related to mathematics or education"
          >
            <Form.Item
              name="qualificationSelect"
              rules={[
                {
                  required: true,
                  message: "Please select your qualification!",
                },
              ]}
              style={{ marginBottom: customQualification ? 8 : 0 }}
            >
              <Select
                placeholder="Select your highest qualification"
                onChange={handleQualificationChange}
                suffixIcon={<BookOutlined />}
              >
                {qualifications.map((qual) => (
                  <Option key={qual} value={qual}>
                    {qual}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {customQualification && (
              <Form.Item
                name="qualificationCustom"
                rules={[
                  {
                    required: true,
                    message: "Please specify your qualification!",
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  placeholder="Please specify your qualification"
                  onChange={handleCustomQualificationChange}
                />
              </Form.Item>
            )}

            {/* Hidden field to store the actual value */}
            <Form.Item name="highestQualification" hidden>
              <Input />
            </Form.Item>
          </Form.Item>

          {/* Years of Math Teaching */}
          <Form.Item
            name="yearsOfMathTeaching"
            label="Years of Math Teaching Experience"
            rules={[
              {
                required: true,
                message: "Please enter your teaching experience!",
              },
              {
                type: "number",
                min: 0,
                message: "Years of experience must be a positive number!",
              },
            ]}
            tooltip="How many years have you been teaching mathematics"
          >
            <InputNumber
              min={0}
              placeholder="Years of experience"
              style={{ width: "100%" }}
              prefix={<HistoryOutlined />}
            />
          </Form.Item>

          {/* Biography */}
          <Form.Item
            name="biography"
            label="Professional Biography"
            rules={[
              {
                required: true,
                message: "Please enter your professional biography!",
              },
              {
                min: 50,
                message: "Biography should be at least 50 characters.",
              },
            ]}
            tooltip="Share your teaching philosophy, approach, and expertise"
          >
            <TextArea
              rows={6}
              placeholder="Write about your teaching experience, philosophy, areas of expertise, and approach to teaching mathematics..."
              showCount
              maxLength={2000}
            />
          </Form.Item>

          {/* If we need to show student associations in the future */}
          {initialValues?.students && initialValues.students.length > 0 && (
            <Form.Item label="Associated Students">
              <Alert
                message={`${initialValues.students.length} student(s) associated with this educator`}
                type="info"
                showIcon
              />
              <Text type="secondary" style={{ marginTop: 8, display: "block" }}>
                Student associations can be managed from the students section.
              </Text>
            </Form.Item>
          )}

          <Divider />

          {/* Form Actions */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              block
            >
              {initialValues ? "Update Profile" : "Create Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
}
