import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  message,
  Card,
  Input,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { useTestAction, useTestState } from "@/provider/test-provider";
import { TestDto } from "@/provider/test-provider/context";
import { difficultLevel } from "@/enums/difficultLevel";
import styles from "./styles/testList.module.css";

const { Title, Text } = Typography;

const TestList: React.FC = () => {
  const router = useRouter();
  const { getAllTests, deleteTest } = useTestAction();
  const { tests, isPending, isSuccess, isError } = useTestState();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getAllTests();
  }, [getAllTests]);

  useEffect(() => {
    if (isSuccess && (!tests || tests.length === 0)) {
      getAllTests();
    }
  }, [isSuccess, tests, getAllTests]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this test?",
      content:
        "This action cannot be undone. All test data including results will be permanently removed.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteTest(id);
        message.success("Test deleted successfully");
      },
    });
  };

  const getDifficultyColor = (level: difficultLevel) => {
    switch (level) {
      case difficultLevel.Easy:
        return "green";
      case difficultLevel.Medium:
        return "blue";
      case difficultLevel.Difficult:
        return "orange";
      default:
        return "default";
    }
  };

  const getDifficultyLabel = (level: difficultLevel) => {
    switch (level) {
      case difficultLevel.Easy:
        return "Easy";
      case difficultLevel.Medium:
        return "Medium";
      case difficultLevel.Difficult:
        return "Difficult";
      default:
        return "Unknown";
    }
  };

  const filteredTests = tests?.filter(
    (test) =>
      test.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<TestDto> = [
    {
      title: "Test Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Difficulty",
      dataIndex: "difficultyLevel",
      key: "difficultyLevel",
      render: (level: difficultLevel) => (
        <Tag color={getDifficultyColor(level)}>{getDifficultyLabel(level)}</Tag>
      ),
    },
    {
      title: "Time Limit",
      dataIndex: "timeLimitMinutes",
      key: "timeLimitMinutes",
      render: (mins: number) => `${mins} minutes`,
    },
    {
      title: "Passing %",
      dataIndex: "passingPercentage",
      key: "passingPercentage",
      render: (percent: number) => `${percent}%`,
    },
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (questions: TestDto["questions"]) => questions?.length || 0,
    },
    {
      title: "Attempts",
      dataIndex: "attempts",
      key: "attempts",
      render: (attempts: number) => attempts || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: TestDto) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/tests/${record.id}`)}
            title="Preview Test"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/tests/${record.id}/edit`)}
            title="Edit Test"
          />
          <Button
            type="text"
            icon={<FileTextOutlined />}
            onClick={() => router.push(`/tests/${record.id}/results`)}
            title="View Results"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id!)}
            title="Delete Test"
          />
        </Space>
      ),
    },
  ];

  if (isPending && !tests?.length) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p>Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.testListContainer}>
      <Card className={styles.listCard}>
        <div className={styles.listHeader}>
          <Title level={2}>Your Tests</Title>
          <Space>
            <Input
              placeholder="Search tests..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.searchInput}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/tests/create")}
            >
              Create New Test
            </Button>
          </Space>
        </div>

        {isError && (
          <div className={styles.errorMessage}>
            Failed to load tests. Please try again later.
          </div>
        )}

        <Table<TestDto>
          dataSource={filteredTests}
          columns={columns}
          rowKey="id"
          loading={isPending}
          pagination={{ pageSize: 10 }}
          className={styles.testTable}
        />

        {tests?.length === 0 && !isPending && (
          <div className={styles.emptyState}>
            <FileTextOutlined className={styles.emptyIcon} />
            <Text>&quot;not created yet&quot;</Text>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/tests/create")}
            >
              Create Your First Test
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TestList;
