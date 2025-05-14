"use client";
import { Form, Input, Button, DatePicker, message } from "antd";
import { useAuthActions } from "@/provider/auth-provider";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ICreateStudent } from "@/provider/auth-provider/context";

export default function StudentSignupForm() {
  const [form] = Form.useForm();
  const { signUp } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ICreateStudent) => {
    try {
      setLoading(true);
      await signUp({
        ...values,
        dateOfBirth: values.dateOfBirth,
      });
      message.success("Student registration successful!");
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

      <Form.Item label="Username" name="username" rules={[{ required: true }]}>
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
        label="Student Number"
        name="studentNumber"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[{ required: true }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item
        label="Educator ID"
        name="educatorId"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full"
        >
          Register as Student
        </Button>
      </Form.Item>
    </Form>
  );
}
