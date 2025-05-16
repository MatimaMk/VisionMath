"use client";
import { useUserState, useUserActions } from "@/provider/users-provider";
import {
  Card,
  Skeleton,
  Row,
  Col,
  Button,
  Statistic,
  Divider,
  Space,
} from "antd";
import { Typography } from "antd";
import {
  BookOutlined,
  TrophyOutlined,
  RiseOutlined,
  CalculatorOutlined,
  FunctionOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import styles from "@/app/educator-dashboard/styles/welcome.module.css";
import { mathTestService } from "@/components/aiServices/mathTestService";
import { TestResult } from "@/app/interfaces/mathTestTypes";

const { Title, Paragraph, Text } = Typography;

function WelcomePage() {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const [hasFetched, setHasFetched] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedTests: 0,
    averageScore: 0,
    highestScore: 0,
    currentStreak: 0,
    totalTimeSpent: 0,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!hasFetched && token) {
      setHasFetched(true);
      getCurrentUser(token);
    }
  }, [hasFetched, getCurrentUser]);

  // Load test history and calculate stats
  useEffect(() => {
    async function loadTestData() {
      try {
        setLoading(true);
        const history = await mathTestService.getTestHistory();
        setTestHistory(history);

        // Calculate stats from test history
        if (history.length > 0) {
          // Completed tests count
          const completedTests = history.length;

          // Average score
          const totalScore = history.reduce((sum, test) => sum + test.score, 0);
          const averageScore = Math.round(totalScore / completedTests);

          // Highest score
          const highestScore = Math.max(...history.map((test) => test.score));

          // Total time spent (in minutes)
          const totalTimeSpent = Math.round(
            history.reduce(
              (sum, test) => sum + (test.time_in_seconds || 0),
              0
            ) / 60
          );

          // Calculate streak (consecutive days with completed tests)
          // This is a simplified version that counts recent consecutive tests
          let currentStreak = 0;
          const sortedTests = [...history].sort(
            (a, b) =>
              new Date(b.completed_at || "").getTime() -
              new Date(a.completed_at || "").getTime()
          );

          if (sortedTests.length > 0) {
            currentStreak = 1;

            for (let i = 1; i < Math.min(sortedTests.length, 7); i++) {
              if (sortedTests[i].completed_at) {
                currentStreak++;
              } else {
                break;
              }
            }
          }

          setStats({
            completedTests,
            averageScore,
            highestScore,
            currentStreak,
            totalTimeSpent,
          });
        }
      } catch (error) {
        console.error("Error loading test history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTestData();
  }, []);

  // Sample math categories
  const mathCategories = [
    {
      title: "Algebra",
      icon: <FunctionOutlined className={styles.categoryIcon} />,
      description: "Master equations, functions and mathematical structures",
    },
    {
      title: "Geometry",
      icon: <CalculatorOutlined className={styles.categoryIcon} />,
      description: "Explore shapes, sizes and properties of space",
    },
    {
      title: "Calculus",
      icon: <RiseOutlined className={styles.categoryIcon} />,
      description: "Learn limits, derivatives, integrals and infinite series",
    },
    {
      title: "Statistics",
      icon: <ExperimentOutlined className={styles.categoryIcon} />,
      description: "Analyze and interpret data with statistical methods",
    },
  ];

  // Get recent test topics for recommendations
  const getRecentTopics = () => {
    if (testHistory.length === 0)
      return [
        { title: "Differential Equations", progress: 30 },
        { title: "Linear Algebra", progress: 15 },
        { title: "Probability Theory", progress: 0 },
      ];

    // Extract unique topics from test history
    const topicsWithScores = testHistory
      .filter((test) => test.math_tests?.topic)
      .map((test) => ({
        title: test.math_tests?.topic || "",
        score: test.score,
        difficulty: test.math_tests?.difficulty,
      }));

    // Group by topic and calculate average score (as progress)
    const topicProgress = new Map();
    topicsWithScores.forEach((item) => {
      if (!topicProgress.has(item.title)) {
        topicProgress.set(item.title, {
          totalScore: item.score,
          count: 1,
          difficulty: item.difficulty,
        });
      } else {
        const current = topicProgress.get(item.title);
        topicProgress.set(item.title, {
          totalScore: current.totalScore + item.score,
          count: current.count + 1,
          difficulty: current.difficulty || item.difficulty,
        });
      }
    });

    // Convert to array and calculate progress
    return Array.from(topicProgress.entries())
      .map(([title, data]) => ({
        title,
        progress: Math.round(data.totalScore / data.count),
        difficulty: data.difficulty,
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3); // Take top 3
  };

  const recommendedTopics = getRecentTopics();

  if (!hasFetched || !currentUser || loading) {
    // Still fetching, show skeleton
    return (
      <div className={styles.skeletonContainer}>
        <Card className={styles.skeletonCard}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* <GeminiChat
        currentUser={{ ...currentUser, id: currentUser.id?.toString() }}
        recommendedTopics={recommendedTopics.map((topic) => topic.title)}
        completedLessons={testHistory.length}
        mathProgress={stats.averageScore}
        mathCategories={mathCategories.map((category) => ({
          ...category,
          progress: 0, // Default progress value
        }))}
        currentStreak={stats.currentStreak}
        mathScore={stats.highestScore} *
      /> */}
      <Row gutter={[24, 24]} className={styles.welcomeSection}>
        <Col xs={24} lg={16}>
          <Card bordered={false} className={styles.welcomeCard}>
            <div className={styles.welcomeHeader}>
              <Title level={2} className={styles.welcomeTitle}>
                <span className={styles.wave}>👋</span>
                Welcome back, {currentUser.name || "Scholar"}!
              </Title>
              <div className={styles.mathSymbols}>
                <span>∫</span>
                <span>π</span>
                <span>√</span>
                <span>∑</span>
              </div>
            </div>

            <Paragraph className={styles.welcomeText}>
              Continue your mathematical journey with personalized lessons,
              practice exercises, and challenging problems to enhance your
              skills.
            </Paragraph>

            <Space size="large" className={styles.statsContainer}>
              <Statistic
                title="Completed Tests"
                value={stats.completedTests}
                prefix={<BookOutlined />}
                className={styles.stat}
              />
              <Statistic
                title="Current Streak"
                value={stats.currentStreak}
                suffix="days"
                prefix={<TrophyOutlined />}
                className={styles.stat}
              />
              <Statistic
                title="Average Score"
                value={stats.averageScore}
                prefix={<RiseOutlined />}
                suffix="%"
                className={styles.stat}
              />
            </Space>

            <div className={styles.actionButtons}>
              <Button
                type="primary"
                size="large"
                className={styles.continueButton}
                href="/studentDash/mathTest"
              >
                Take New Test
              </Button>
              <Button
                size="large"
                style={{ borderColor: "#20B2AA", color: "#20B2AA" }}
                href="/studentDash/aiResults"
              >
                View Results
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  {(currentUser.name?.[0] || "U").toUpperCase()}
                </div>
              </div>
              <Title level={4} className={styles.profileName}>
                {currentUser.name} {currentUser.surname}
              </Title>
              <Text type="secondary">{currentUser.emailAddress}</Text>
            </div>

            <Divider />

            <div className={styles.profileStats}>
              <div className={styles.profileStat}>
                <Text strong>Highest Score</Text>
                <Text>{stats.highestScore}%</Text>
              </div>
              <div className={styles.profileStat}>
                <Text strong>Last Active</Text>
                <Text>
                  {testHistory.length > 0 && testHistory[0].completed_at
                    ? new Date(testHistory[0].completed_at).toLocaleDateString()
                    : "Today"}
                </Text>
              </div>
              <div className={styles.profileStat}>
                <Text strong>Time Spent</Text>
                <Text>{stats.totalTimeSpent} minutes</Text>
              </div>
            </div>

            <Button block className={styles.viewProfileButton}>
              View Full Profile
            </Button>
          </Card>
        </Col>
      </Row>

      <Title level={3} className={styles.sectionTitle}>
        Continue Exploring Mathematics
      </Title>

      <Row gutter={[16, 16]} className={styles.categoriesSection}>
        {mathCategories.map((category, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable className={styles.categoryCard}>
              <div className={styles.categoryContent}>
                {category.icon}
                <Title level={4}>{category.title}</Title>
                <Paragraph className={styles.categoryDescription}>
                  {category.description}
                </Paragraph>
                <Button
                  type="link"
                  className={styles.exploreButton}
                  href={`/studentDash/mathTest`}
                >
                  Explore
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} className={styles.recommendedSection}>
        <Col span={24}>
          <Card bordered={false} className={styles.recommendedCard}>
            <Title level={4}>Recommended For You</Title>
            <Paragraph>
              Based on your learning progress, we suggest these topics:
            </Paragraph>
            <Row gutter={[16, 16]}>
              {recommendedTopics.map((topic, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className={styles.recTopicCard}>
                    <Title level={5}>{topic.title}</Title>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                      <span className={styles.progressText}>
                        {topic.progress}%
                      </span>
                    </div>
                    <Button
                      type="primary"
                      block
                      href={`/studentDash/aiTestGenerator?topic=${topic.title.toLowerCase()}&difficulty=${
                        topic.title
                      }`}
                    >
                      {topic.progress > 0 ? "Continue" : "Start Learning"}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default WelcomePage;
