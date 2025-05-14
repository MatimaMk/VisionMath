"use client";
import { Form, Input, Button, Select, message } from "antd";
import { useAuthActions } from "@/provider/auth-provider";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ICreateEducator } from "@/provider/auth-provider/context";

const qualifications = [
  "National Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D",
  "Professional Certificate",
  "Other",
];

export default function EducatorSignupForm() {
  const [form] = Form.useForm();
  const { signUpEdu } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ICreateEducator) => {
    try {
      setLoading(true);
      await signUpEdu(values);
      message.success("Educator registration successful!");
    } catch (error) {
      message.error("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Last Name" name="surname" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="emailAddress"
        rules={[{ required: true, type: "email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Username" name="userName" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, min: 8 }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Highest Qualification"
        name="highestQualification"
        rules={[{ required: true }]}
      >
        <Select options={qualifications.map((q) => ({ value: q, label: q }))} />
      </Form.Item>

      <Form.Item
        label="Years of Teaching Experience"
        name="yearsOfMathTeaching"
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Biography"
        name="biography"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full"
        >
          Register as Educator
        </Button>
      </Form.Item>
    </Form>
  );
}
