"use client";
import { useState } from "react";
import { Tabs } from "antd";
import StudentSignupForm from "@/components/student-signUpForm/page";
import EducatorSignupForm from "@/components/educator-signupForm/page";

export default function UnifiedSignup() {
  const [activeTab, setActiveTab] = useState("student");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        centered
        items={[
          {
            key: "student",
            label: "Student",
            children: <StudentSignupForm />,
          },
          {
            key: "educator",
            label: "Educator",
            children: <EducatorSignupForm />,
          },
        ]}
      />
    </div>
  );
}
