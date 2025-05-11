import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Typography,
  Select,
  Input,
  Space,
  Badge,
  Spin,
  Empty,
} from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  BookOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { useTestAction, useTestState } from "@/provider/test-provider";
import { TestDto } from "@/provider/test-provider/context";
import { difficultLevel } from "@/enums/difficultLevel";
import styles from "./styles/testList.module.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface TestWithStatus extends TestDto {
  submissionId?: string;
}

interface TestCardProps {
  test: TestWithStatus;
  attempted?: boolean;
  score?: number;
  lastAttempt?: Date;
}

const TestCard: React.FC<TestCardProps> = ({
  test,
  attempted = false,
  score,
  lastAttempt,
}) => {
  const router = useRouter();

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

  const getStatusTag = () => {
    if (attempted) {
      if (score !== undefined) {
        const passed = score >= (test.passingPercentage || 70);
        return (
          <Tag
            icon={
              passed ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
            }
            color={passed ? "success" : "error"}
          >
            {passed ? `Passed - ${score}%` : `Failed - ${score}%`}
          </Tag>
        );
      }
      return <Tag color="warning">Under Review</Tag>;
    }
    return <Tag color="processing">Not Attempted</Tag>;
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className={styles.testCard} hoverable>
      <div className={styles.cardHeader}>
        <Badge
          count={
            attempted
              ? score !== undefined && score >= (test.passingPercentage || 70)
                ? "✓"
                : "×"
              : null
          }
          status={
            attempted
              ? score !== undefined && score >= (test.passingPercentage || 70)
                ? "success"
                : "error"
              : "default"
          }
          className={styles.statusBadge}
        />
        <div className={styles.cardTitle}>
          <Title level={4}>{test.title}</Title>
          {getStatusTag()}
        </div>
        <div className={styles.cardMeta}>
          <Tag color={getDifficultyColor(test.difficultyLevel)}>
            {getDifficultyLabel(test.difficultyLevel)}
          </Tag>
        </div>
      </div>

      <Paragraph ellipsis={{ rows: 2 }} className={styles.cardDescription}>
        {test.description || "No description available"}
      </Paragraph>

      <div className={styles.cardInfo}>
        <div className={styles.infoItem}>
          <ClockCircleOutlined />
          <Text>{test.timeLimitMinutes} minutes</Text>
        </div>
        <div className={styles.infoItem}>
          <FileTextOutlined />
          <Text>{test.questions?.length || 0} questions</Text>
        </div>
        <div className={styles.infoItem}>
          <TrophyOutlined />
          <Text>Pass: {test.passingPercentage}%</Text>
        </div>
      </div>

      {attempted && lastAttempt && (
        <div className={styles.lastAttempt}>
          <Text type="secondary">Last attempt: {formatDate(lastAttempt)}</Text>
        </div>
      )}

      <div className={styles.cardActions}>
        {!attempted ? (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => router.push(`/tests/${test.id}`)}
          >
            Start Test
          </Button>
        ) : (
          <Space>
            <Button
              icon={<FileTextOutlined />}
              onClick={() =>
                router.push(`/tests/${test.id}/results/${test.submissionId}`)
              }
            >
              View Results
            </Button>
            {score !== undefined && score < (test.passingPercentage || 70) && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => router.push(`/tests/${test.id}`)}
              >
                Retake Test
              </Button>
            )}
          </Space>
        )}
      </div>
    </Card>
  );
};

const StudentTestList: React.FC = () => {
  const { getAllTests } = useTestAction();
  const { tests, isPending, isError } = useTestState();

  const [searchText, setSearchText] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    difficultLevel | undefined
  >(undefined);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "attempted" | "not-attempted" | "passed" | "failed"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "difficulty" | "alphabetical"
  >("newest");

  useEffect(() => {
    getAllTests();
  }, [getAllTests]);

  // Mock student test status - in a real app, this would come from the backend
  const getTestStatus = (testId: string) => {
    const random = Math.random();
    if (random > 0.7) {
      const score = Math.floor(Math.random() * 100);
      const lastAttempt = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      );
      return {
        attempted: true,
        score,
        submissionId: `sub_${testId}_${Date.now()}`,
        lastAttempt,
      };
    }
    return { attempted: false };
  };

  const filteredAndSortedTests = tests
    ?.filter((test) => {
      // Text search
      const matchesSearch =
        test.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchText.toLowerCase());

      // Difficulty filter
      const matchesDifficulty =
        !difficultyFilter || test.difficultyLevel === difficultyFilter;

      // Status filter
      const status = getTestStatus(test.id!);
      let matchesStatus = true;
      if (statusFilter === "attempted") {
        matchesStatus = status.attempted;
      } else if (statusFilter === "not-attempted") {
        matchesStatus = !status.attempted;
      } else if (statusFilter === "passed") {
        matchesStatus =
          status.attempted &&
          status.score !== undefined &&
          status.score >= (test.passingPercentage || 70);
      } else if (statusFilter === "failed") {
        matchesStatus =
          status.attempted &&
          status.score !== undefined &&
          status.score < (test.passingPercentage || 70);
      }

      return matchesSearch && matchesDifficulty && matchesStatus;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.creationTime || Date.now()).getTime() -
            new Date(a.creationTime || Date.now()).getTime()
          );
        case "oldest":
          return (
            new Date(a.creationTime || Date.now()).getTime() -
            new Date(b.creationTime || Date.now()).getTime()
          );
        case "difficulty":
          const difficultyOrder = {
            [difficultLevel.Easy]: 1,
            [difficultLevel.Medium]: 2,
            [difficultLevel.Difficult]: 3,
          };
          return (
            (difficultyOrder[a.difficultyLevel] || 0) -
            (difficultyOrder[b.difficultyLevel] || 0)
          );
        case "alphabetical":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

  if (isPending && !tests?.length) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading tests...</Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.error}>
        <ExclamationCircleOutlined
          style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }}
        />
        <Title level={3}>Error Loading Tests</Title>
        <Text>Unable to load available tests. Please try again later.</Text>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={() => getAllTests()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.testListContainer}>
      <div className={styles.listHeader}>
        <div className={styles.headerTop}>
          <div>
            <Title level={2}>Available Tests</Title>
            <Text type="secondary">
              {filteredAndSortedTests?.length || 0} tests available
            </Text>
          </div>
        </div>

        <div className={styles.filterSection}>
          <Input
            placeholder="Search tests..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
            allowClear
          />

          <Select
            placeholder="Difficulty"
            allowClear
            value={difficultyFilter}
            onChange={(value: difficultLevel) => setDifficultyFilter(value)}
            className={styles.filterSelect}
          >
            <Option value={difficultLevel.Easy}>Easy</Option>
            <Option value={difficultLevel.Medium}>Medium</Option>
            <Option value={difficultLevel.Difficult}>Difficult</Option>
          </Select>

          <Select
            placeholder="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            className={styles.filterSelect}
          >
            <Option value="all">All Tests</Option>
            <Option value="attempted">Attempted</Option>
            <Option value="not-attempted">Not Attempted</Option>
            <Option value="passed">Passed</Option>
            <Option value="failed">Failed</Option>
          </Select>

          <Select
            placeholder="Sort by"
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            className={styles.filterSelect}
          >
            <Option value="newest">Newest First</Option>
            <Option value="oldest">Oldest First</Option>
            <Option value="difficulty">Difficulty</Option>
            <Option value="alphabetical">Alphabetical</Option>
          </Select>
        </div>
      </div>

      {filteredAndSortedTests?.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            image={<BookOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
            description={
              <div>
                <Title level={4}>No tests found</Title>
                <Text type="secondary">
                  {tests?.length === 0
                    ? "No tests are currently available."
                    : "Try adjusting your search or filters."}
                </Text>
              </div>
            }
          />
        </div>
      ) : (
        <Row gutter={[16, 16]} className={styles.testGrid}>
          {filteredAndSortedTests?.map((test) => {
            const status = getTestStatus(test.id!);
            return (
              <Col xs={24} sm={12} lg={8} key={test.id}>
                <TestCard
                  test={{
                    ...test,
                    submissionId: status.attempted
                      ? status.submissionId
                      : undefined,
                  }}
                  attempted={status.attempted}
                  score={status.score}
                  lastAttempt={status.lastAttempt}
                />
              </Col>
            );
          })}
        </Row>
      )}

      {isPending && (tests?.length ?? 0) > 0 && (
        <div className={styles.loadingMore}>
          <Spin />
        </div>
      )}
    </div>
  );
};

export default StudentTestList;
