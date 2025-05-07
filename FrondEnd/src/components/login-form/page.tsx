// src/components/login-form.tsx
"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthActions } from "@/provider/auth-provider";
import { useUserActions } from "@/provider/users-provider";
import { ISignInRequest } from "@/provider/auth-provider/context";
//import styles from "../../app/login/login-page.module.css";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onBeforeSubmit?: () => void;
}

export default function LoginForm({
  onLoginSuccess,
  onBeforeSubmit,
}: LoginFormProps) {
  const { signIn } = useAuthActions();
  const { getCurrentUser } = useUserActions();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<ISignInRequest>();
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccessToast = (msg: string = "Successfully logged in!") => {
    messageApi.success({
      content: msg,
      duration: 3,
      style: { marginTop: "20px" },
    });
  };

  const showErrorToast = (
    msg: string = "Login failed! Please check your credentials."
  ) => {
    messageApi.error({
      content: msg,
      duration: 5,
      style: { marginTop: "20px" },
    });
  };

  const onFinishLogin = async (values: ISignInRequest) => {
    onBeforeSubmit?.();
    setLoading(true);

    try {
      const loginResult = await signIn(values);

      if (loginResult?.result?.accessToken) {
        const token = loginResult.result.accessToken;
        sessionStorage.setItem("jwt", token);
        await getCurrentUser(token);
        showSuccessToast();
        onLoginSuccess?.();
      } else {
        showErrorToast("Invalid login response");
      }
    } catch (error: unknown) {
      let errorMessage = "Login failed! Please check your credentials.";

      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: { message?: string } } };
        };
        errorMessage =
          axiosError.response?.data?.error?.message || errorMessage;
      }

      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form<ISignInRequest>
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinishLogin}
        size="large"
        layout="vertical"
        //className={styles.form}
      >
        <Form.Item
          name="userNameOrEmailAddress"
          validateTrigger={["onBlur", "onSubmit"]}
          rules={[
            { required: true, message: "Please input your email or username!" },
            {
              validator(_, value) {
                if (
                  !value || value.includes("@")
                    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    : true
                ) {
                  return Promise.resolve();
                }
                return Promise.reject("Please enter a valid email or username");
              },
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email or Username"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            //  className={styles.submitButton}
            loading={loading}
            disabled={loading}
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
