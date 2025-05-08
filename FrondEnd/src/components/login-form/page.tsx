"use client";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Divider,
  Row,
  Col,
  Typography,
  Card,
} from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useAuthActions } from "@/provider/auth-provider";
import { useUserActions } from "@/provider/users-provider";
import { ISignInRequest } from "@/provider/auth-provider/context";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Title, Text, Paragraph } = Typography;

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
  const router = useRouter();

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
        router.push("/educator-dashboard");
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
      <Card
        bordered={false}
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          borderRadius: "12px",
          overflow: "hidden",
          padding: 0,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Row>
          {/* Left side - Mathematics illustration */}
          <Col xs={24} md={12} style={{ padding: 0 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #20B2AA 0%, #4ade80 100%)",
                height: "100%",
                minHeight: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                padding: "24px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.1,
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "100%" }}
                >
                  <path
                    fill="#FFFFFF"
                    d="M47.7,-61.1C58.9,-53.1,63.2,-34.4,65.3,-16.6C67.4,1.3,67.3,18.3,60.1,31.1C52.9,44,38.7,52.7,23.2,59.3C7.7,65.9,-9.1,70.3,-24.9,67.4C-40.7,64.4,-55.6,54.1,-65.2,39.2C-74.9,24.3,-79.3,4.9,-74.9,-11.9C-70.5,-28.7,-57.4,-42.9,-42.8,-50.4C-28.1,-57.9,-14.1,-58.8,2.1,-61.6C18.2,-64.4,36.5,-69.1,47.7,-61.1Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>

              <div
                style={{ position: "relative", zIndex: 1, textAlign: "center" }}
              >
                <Title
                  level={2}
                  style={{ color: "white", marginBottom: "16px" }}
                >
                  Welcome to VisionMath
                </Title>
                <Paragraph style={{ color: "white", marginBottom: "24px" }}>
                  Transform how you teach and learn mathematics with AI-powered
                  Visual Learning.
                </Paragraph>
                <div
                  style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                >
                  <img
                    src="/api/placeholder/300/300"
                    alt="Mathematics Learning Illustration"
                    style={{ width: "100%", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </Col>

          {/* Right side - Login form */}
          <Col xs={24} md={12} style={{ padding: "40px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Title
                level={2}
                style={{
                  fontSize: "24px",
                  marginBottom: "8px",
                  color: "linear-gradient(135deg, #20B2AA 0%, #4ade80 100%)",
                }}
              >
                Log In to Your Account
              </Title>
              <Text type="secondary">
                Access your personalized teaching resources
              </Text>
            </div>

            <Form<ISignInRequest>
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinishLogin}
              size="large"
              layout="vertical"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <Form.Item
                name="userNameOrEmailAddress"
                validateTrigger={["onBlur", "onSubmit"]}
                rules={[
                  {
                    required: true,
                    message: "Please input your email or username!",
                  },
                  {
                    validator(_, value) {
                      if (
                        !value || value.includes("@")
                          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                          : true
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Please enter a valid email or username"
                      );
                    },
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Email or Username"
                  disabled={loading}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Password"
                  disabled={loading}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  block
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor:
                      "linear-gradient(135deg, #20B2AA 0%, #4ade80 100%)",
                    borderColor: "#20B2AA",
                  }}
                >
                  Log In
                </Button>
              </Form.Item>

              <Divider plain>or</Divider>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#595959",
                }}
              >
                Don't have an account?{" "}
                <a
                  href="#"
                  style={{
                    color: "linear-gradient(135deg, #20B2AA 0%, #4ade80 100%)",
                    fontWeight: 500,
                  }}
                >
                  Sign up
                </a>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
}
