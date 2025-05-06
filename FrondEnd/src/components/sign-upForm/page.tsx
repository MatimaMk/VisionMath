"use client";
import { useState, useRef, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  DatePicker,
  RadioChangeEvent,
  Spin,
  message,
  Modal,
} from "antd";
import dayjs from "dayjs";
import {
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useAuthActions } from "@/provider/auth-provider";
//mport { useCheckuserActions } from "@/providers/check-user-provider";
import { ICreateStudent } from "../../provider/auth-provider/context";
import { RuleObject } from "antd/lib/form";

import styles from "../../app/login/login-page.module.css";
// import {
//   useEducatorState,
//   useEducatorActions,
// } from "@/providers/educator-provider";

const qualifications = [
  "High School Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D",
  "Professional Certificate",
  "Other",
];

const { Option } = Select;

interface SignupFormProps {
  onSignupSuccess?: () => void;
  onBeforeSubmit?: () => void;
}

export default function EducationalSignupForm({
  onBeforeSubmit,
}: SignupFormProps) {
  const [role, setRole] = useState<"student" | "educator">("student");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [adminPasswordModalVisible, setAdminPasswordModalVisible] =
    useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  const { signUp } = useAuthActions();
  //const { userExists } = useCheckuserActions();
  //   const { educators = [], isPending } = useEducatorState();
  //   const { getAllEducators } = useEducatorActions();
  const [form] = Form.useForm();
  const ADMIN_PASSWORD = "123qwe"; // Hardcoded for now

  //   useEffect(() => {
  //     getAllEducators();
  //   }, []);

  //   const debouncedEmailCheck = useRef(
  //     debounce(async (value: string) => {
  //       const result = await userExists({ emailAddress: value, userName: "" });
  //       return result.result.emailExists;
  //     }, 500)
  //   ).current;

  //   const debouncedUsernameCheck = useRef(
  //     debounce(async (value: string) => {
  //       const result = await userExists({ emailAddress: "", userName: value });
  //       return result.result.userNameExists;
  //     }, 500)
  //   ).current;

  const passwordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };

  const hasErrors = form
    .getFieldsError()
    .some(({ errors }) => errors.length > 0);
  const isButtonDisabled = loading || hasErrors;

  //   const validateEmailExists = async (_: RuleObject, value: string) => {
  //     if (!value) return Promise.resolve();
  //     const emailExists = await debouncedEmailCheck(value);
  //     if (emailExists) return Promise.reject("Email already exists");
  //     return Promise.resolve();
  //   };

  //   const validateUsernameExists = async (_: RuleObject, value: string) => {
  //     if (!value) return Promise.resolve();
  //     const usernameExists = await debouncedUsernameCheck(value);
  //     if (usernameExists) return Promise.reject("Username already exists");
  //     return Promise.resolve();
  //   };

  const handleRoleChange = (e: RadioChangeEvent) => {
    const selectedRole = e.target.value.toLowerCase();

    if (selectedRole === "educator") {
      setAdminPasswordModalVisible(true);
    } else {
      setRole("student");
      form.setFieldsValue({ role: "STUDENT" });
    }
  };

  const onFinishSignup = async (values: ICreateStudent) => {
    onBeforeSubmit?.();
    setLoading(true);

    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? dayjs(values.dateOfBirth).toDate()
        : undefined,
    };

    await signUp(formattedValues);
    setLoading(false);
  };

  return (
    <Spin spinning={loading} tip="Creating your account...">
      <Form
        form={form}
        name="signup"
        onFinish={onFinishSignup}
        size="large"
        layout="vertical"
        className={styles.form}
        initialValues={{ role: "STUDENT" }}
      >
        <div className={styles.signupGrid}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account Type</h3>
          </div>

          <Form.Item
            name="role"
            label="I am a:"
            className={styles.fullWidth}
            rules={[
              { required: true, message: "Please select your account type!" },
            ]}
          >
            <Radio.Group onChange={handleRoleChange} value={role}>
              <Radio value="STUDENT">Student</Radio>
              <Radio value="EDUCATOR">Educator</Radio>
            </Radio.Group>
          </Form.Item>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
          </div>

          <Form.Item
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="surname"
            rules={[{ required: true, message: "Please input your surname!" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account Information</h3>
          </div>

          <Form.Item
            name="emailAddress"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
              //{ validator: validateEmailExists },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="username"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "Please input your username!" },
              // { validator: validateUsernameExists },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            className={styles.fullWidth}
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <div style={{ position: "relative" }}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowTooltip(e.target.value.length > 0);
                }}
                onBlur={() => setShowTooltip(false)}
                onFocus={() => password && setShowTooltip(true)}
              />
              {showTooltip && (
                <div className={styles.passwordStrengthTooltip}>
                  <p>Password must contain:</p>
                  {Object.entries(passwordChecks).map(([key, valid]) => (
                    <div key={key} className={styles.passwordCheck}>
                      {valid ? (
                        <CheckCircleOutlined className={styles.valid} />
                      ) : (
                        <CloseCircleOutlined className={styles.invalid} />
                      )}
                      <span className={valid ? styles.valid : styles.invalid}>
                        {key === "length" && "At least 8 characters"}
                        {key === "lowercase" && "At least one lowercase letter"}
                        {key === "uppercase" && "At least one uppercase letter"}
                        {key === "number" && "At least one number"}
                        {key === "specialChar" &&
                          "At least one special character (!@#$%^&*)"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Form.Item>

          {/* Student Fields */}
          {role === "student" && (
            <>
              <Form.Item
                name="studentNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input your student number!",
                  },
                ]}
              >
                <Input placeholder="Student Number" />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                rules={[
                  { required: true, message: "Please input date of birth!" },
                ]}
              >
                <DatePicker
                  placeholder="Date of Birth"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="educatorId"
                rules={[
                  { required: true, message: "Please select your educator!" },
                ]}
              >
                {/* <Select
                  placeholder="Select Your Educator"
                  showSearch
                  loading={isPending}
                  optionLabelProp="label"
                  filterOption={(input, option) =>
                    (option?.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={educators.map((educator) => ({
                    label: `${educator.firstName} ${educator.surname}`,
                    value: educator.id,
                  }))}
                /> */}
              </Form.Item>
            </>
          )}

          {/* Educator Fields */}
          {role === "educator" && (
            <>
              <Form.Item
                name="highestQualification"
                rules={[
                  {
                    required: true,
                    message: "Please select your qualification!",
                  },
                ]}
              >
                <Select placeholder="Highest Qualification" showSearch>
                  {qualifications.map((qual) => (
                    <Option key={qual} value={qual}>
                      {qual}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="yearsOfMathTeaching"
                rules={[
                  {
                    required: true,
                    message: "Please input your years of experience!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Years of Math Teaching Experience"
                />
              </Form.Item>

              <Form.Item
                name="biography"
                rules={[
                  { required: true, message: "Please provide a biography!" },
                ]}
              >
                <Input.TextArea placeholder="Professional Biography" rows={4} />
              </Form.Item>
            </>
          )}

          <Form.Item className={styles.fullWidth}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              loading={loading}
              disabled={isButtonDisabled}
            >
              Create Account
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Modal
        title="Admin Verification Required"
        open={adminPasswordModalVisible}
        onOk={() => {
          if (adminPasswordInput === ADMIN_PASSWORD) {
            setRole("educator");
            form.setFieldsValue({ role: "EDUCATOR" });
          } else {
            message.error(
              "Incorrect admin password. Defaulting to student account."
            );
            setRole("student");
            form.setFieldsValue({ role: "STUDENT" });
          }
          setAdminPasswordModalVisible(false);
          setAdminPasswordInput("");
        }}
        onCancel={() => {
          setRole("student");
          form.setFieldsValue({ role: "STUDENT" });
          setAdminPasswordModalVisible(false);
          setAdminPasswordInput("");
        }}
        okText="Continue"
        cancelText="Cancel"
      >
        <p>
          Educator accounts require administrator approval. Please enter the
          admin password to continue.
        </p>
        <Input.Password
          placeholder="Enter admin password"
          value={adminPasswordInput}
          onChange={(e) => setAdminPasswordInput(e.target.value)}
        />
      </Modal>
    </Spin>
  );
}
