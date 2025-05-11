"use client";

import React from "react";

import TestView from "@/components/student/writeTest";

const CreateTestPage: React.FC = () => {
  const testId = "test-123";

  return <TestView testId={testId} />;
};

export default CreateTestPage;
