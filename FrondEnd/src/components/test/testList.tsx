"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Input,
  Row,
  Col,
  Spin,
  Empty,
  Tag,
  Space,
  Badge,
  Statistic,
  Divider,
} from "antd";
import {
  EyeOutlined,
  ClockCircleOutlined,
  BookOutlined,
  ReloadOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTestState, useTestAction } from "@/provider/test-provider";
import axios from "axios";
import styles from "./styles/testList.module.css";
import { TestDto } from "@/provider/test-provider/context";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Meta } = Card;

// Define an interface for API response structure
interface ApiResponse {
  result?: {
    items?: TestDto[];
    totalCount?: number;
  };
  items?: TestDto[];
}

const StudentTestList = () => {
  const router = useRouter();
  const { tests, isPending, isError } = useTestState();
  const { getAllTests } = useTestAction();
  const [searchText, setSearchText] = useState("");
  const [filteredTests, setFilteredTests] = useState<TestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [directFetchedTests, setDirectFetchedTests] = useState<TestDto[]>([]);

  useEffect(() => {
    const fetchTestsDirectly = async () => {
      try {
        setLoading(true);
        setError(false);

        // Replace with your actual API endpoint
        const response = await axios.get(
          "https://localhost:44311/api/services/app/Test/GetAll",
          {
            params: {
              MaxResultCount: 20,
              SkipCount: 0,
            },
          }
        );

        let testsArray: TestDto[] = [];
        const data = response.data as ApiResponse;

        if (data) {
          if (data.result && Array.isArray(data.result.items)) {
            testsArray = data.result.items;
          } else if (Array.isArray(data.items)) {
            testsArray = data.items;
          } else if (Array.isArray(data)) {
            // If the data itself is an array
            testsArray = data as unknown as TestDto[];
          }
        }

        setDirectFetchedTests(testsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error directly fetching tests:", error);
        setError(true);
        setLoading(false);
      }
    };

    getAllTests();

    fetchTestsDirectly();
  }, [getAllTests]);

  useEffect(() => {
    let testsArray: TestDto[] = [];

    if (tests) {
      // First check if tests is already an array
      if (Array.isArray(tests)) {
        testsArray = tests;
      }
      // If tests is not an array, assume it's an object with specific structure
      else if (typeof tests === "object") {
        const testsObj = tests as unknown as ApiResponse;

        if (testsObj.result && Array.isArray(testsObj.result.items)) {
          testsArray = testsObj.result.items;
        } else if (Array.isArray((testsObj as { items?: TestDto[] }).items)) {
          testsArray = (testsObj as { items: TestDto[] }).items;
        }
      }
    }

    // If provider data exists, use it
    if (testsArray && testsArray.length > 0) {
      filterTests(testsArray);
    }
    // Otherwise, use directly fetched data
    else if (directFetchedTests && directFetchedTests.length > 0) {
      filterTests(directFetchedTests);
    }
  }, [tests, searchText, directFetchedTests]);

  // Filter tests based on search text
  const filterTests = (testsToFilter: TestDto[]) => {
    const filtered = testsToFilter.filter(
      (test) =>
        test.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredTests(filtered);
  };

  // Handle clicking on a test to view/take it
  const handleViewTest = (testId: string) => {
    router.push(`/studentDash/writeTest/id=${testId}`);
  };

  // Safe version that checks for null/undefined before navigation
  const handleViewTestSafe = (testId: string | undefined) => {
    if (testId) {
      handleViewTest(testId);
    } else {
      console.warn("Attempted to navigate with null or undefined test ID");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleRetry = () => {
    getAllTests();
    // Also retry direct fetch
    setLoading(true);
    const fetchTestsDirectly = async () => {
      try {
        const response = await axios.get("/api/Test/GetAll", {
          params: {
            MaxResultCount: 20,
            SkipCount: 0,
          },
        });

        let testsArray: TestDto[] = [];
        const data = response.data as ApiResponse;

        if (data) {
          if (data.result && Array.isArray(data.result.items)) {
            testsArray = data.result.items;
          } else if (Array.isArray(data.items)) {
            testsArray = data.items;
          } else if (Array.isArray(data)) {
            testsArray = data as unknown as TestDto[];
          }
        }

        setDirectFetchedTests(testsArray);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error retrying direct fetch:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchTestsDirectly();
  };

  const getDifficultyTag = (level: number) => {
    // Colors based on difficulty
    const tagClasses = ["tag-easy", "tag-medium", "tag-hard"];
    const texts = ["Easy", "Medium", "Hard"];
    const icons = [
      <CheckCircleOutlined key="easy" />,
      <TrophyOutlined key="medium" />,
      <TrophyOutlined key="hard" />,
    ];

    return (
      <Tag className={`${styles[tagClasses[level] || "tag-easy"]}`}>
        <Space>
          {icons[level]}
          {texts[level] || "Unknown"}
        </Space>
      </Tag>
    );
  };

  if (isPending || loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading tests..." />
      </div>
    );
  }

  if ((isError || error) && (!filteredTests || filteredTests.length === 0)) {
    return (
      <Card className={styles.errorCard}>
        <Empty
          description="Failed to load tests. Please try again later."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className={styles.errorActions}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!filteredTests || filteredTests.length === 0) {
    return (
      <Card className={styles.errorCard}>
        <Empty
          description="No tests available at the moment."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  // Tests are available, show them in card format
  return (
    <div className={styles.testListContainer}>
      <Card className={styles.dashboardHeader}>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={12}>
            <Title level={3} className={styles.pageTitle}>
              Available Tests
            </Title>
            <Paragraph className={styles.pageSubtitle}>
              Take a test to assess your knowledge and skills
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={16} justify="end">
              <Col>
                <Card className={styles.statsCard}>
                  <Statistic
                    title="Total Tests"
                    value={filteredTests.length}
                    prefix={<FileTextOutlined />}
                    className={styles.testCounter}
                  />
                </Card>
              </Col>
              <Col>
                <Search
                  placeholder="Search tests..."
                  allowClear
                  onSearch={handleSearchChange}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={styles.searchBox}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Divider className={styles.sectionDivider} />

      <Row gutter={[24, 24]} className={styles.testsGrid}>
        {filteredTests.map((test) => (
          <Col xs={24} sm={12} md={8} lg={6} key={test.id}>
            <Badge.Ribbon
              text={`${test.passingPercentage}% to Pass`}
              color="rgba(255, 255, 255, 0.3)"
              className={styles.testRibbon}
            >
              <Card
                hoverable
                className={styles.testCard}
                cover={
                  <div className={styles.testCardCover}>
                    <BookOutlined className={styles.testCardIcon} />
                  </div>
                }
                onClick={() => handleViewTestSafe(test.id)}
                actions={[
                  <Button
                    key="take"
                    type="primary"
                    icon={<EyeOutlined />}
                    className={styles.takeTestButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewTestSafe(test.id);
                    }}
                  >
                    Take Test
                  </Button>,
                ]}
              >
                <Meta
                  title={
                    <Text strong className={styles.testTitle}>
                      {test.title}
                    </Text>
                  }
                  description={
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        className={styles.testDescription}
                      >
                        {test.description}
                      </Paragraph>
                      <div className={styles.testTags}>
                        {getDifficultyTag(test.difficultyLevel)}
                        {test.timeLimitMinutes && (
                          <Tag
                            color="var(--primary-color-light)"
                            style={{ color: "var(--primary-color)" }}
                          >
                            <Space>
                              <ClockCircleOutlined />
                              {test.timeLimitMinutes} mins
                            </Space>
                          </Tag>
                        )}
                      </div>
                    </Space>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {filteredTests.length === 0 && searchText && (
        <Empty description="No tests match your search criteria." />
      )}
    </div>
  );
};

export default StudentTestList;
