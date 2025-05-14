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
} from "antd";
import {
  EyeOutlined,
  ClockCircleOutlined,
  BookOutlined,
  PercentageOutlined,
  ReloadOutlined,
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
        console.log("Fetching tests directly from API");

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

        console.log("Direct API response:", response.data.result?.items);

        // Extract tests from the response
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

        console.log("Directly fetched tests:", testsArray);
        setDirectFetchedTests(testsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error directly fetching tests:", error);
        setError(true);
        setLoading(false);
      }
    };

    console.log("Fetching tests through provider");
    getAllTests();

    fetchTestsDirectly();
  }, [getAllTests]);

  useEffect(() => {
    console.log("Raw tests data:", tests);
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

    console.log("Extracted tests array from provider:", testsArray);

    // If provider data exists, use it
    if (testsArray && testsArray.length > 0) {
      filterTests(testsArray);
    }
    // Otherwise, use directly fetched data
    else if (directFetchedTests && directFetchedTests.length > 0) {
      console.log("Using directly fetched tests data instead of provider");
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

    console.log("Filtered tests:", filtered.length);
    setFilteredTests(filtered);
  };

  // Handle clicking on a test to view/take it
  const handleViewTest = (testId: string) => {
    console.log("Navigating to test with ID:", testId);
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
    const colors = ["green", "blue", "orange"];
    const texts = ["Easy", "Medium", "Hard"];

    return (
      <Tag color={colors[level] || "blue"}>{texts[level] || "Unknown"}</Tag>
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
      <div className={styles.testListHeader}>
        <Title level={4}>Available Tests</Title>
        <Search
          placeholder="Search tests..."
          allowClear
          onSearch={handleSearchChange}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      <Row gutter={[16, 16]} className={styles.testsGrid}>
        {filteredTests.map((test) => (
          <Col xs={24} sm={12} md={8} lg={6} key={test.id}>
            <Card
              hoverable
              className={styles.testCard}
              onClick={() => handleViewTestSafe(test.id)}
              actions={[
                <Button
                  key="take"
                  type="primary"
                  icon={<EyeOutlined />}
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
                title={<Text strong>{test.title}</Text>}
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {test.description}
                    </Paragraph>
                    <div className={styles.testInfo}>
                      <Space>
                        <ClockCircleOutlined /> {test.timeLimitMinutes} mins
                      </Space>
                      <Space>
                        <PercentageOutlined /> {test.passingPercentage}% to pass
                      </Space>
                    </div>
                    <div className={styles.testTags}>
                      {getDifficultyTag(test.difficultyLevel)}
                      {test.questions && (
                        <Tag color="blue">
                          <BookOutlined /> {test.questions.length || 0}{" "}
                          Questions
                        </Tag>
                      )}
                    </div>
                  </Space>
                }
              />
            </Card>
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
