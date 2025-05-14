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
import styles from "./styles/welcome.module.css";

const { Title, Paragraph, Text } = Typography;

function WelcomePage() {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!hasFetched && token) {
      setHasFetched(true);
      getCurrentUser(token);
    }
  }, [hasFetched, getCurrentUser]);

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

  if (!hasFetched || !currentUser) {
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
                title="Completed Lessons"
                value={12}
                prefix={<BookOutlined />}
                className={styles.stat}
              />
              <Statistic
                title="Current Streak"
                value={5}
                suffix="days"
                prefix={<TrophyOutlined />}
                className={styles.stat}
              />
              <Statistic
                title="Math Score"
                value={850}
                prefix={<RiseOutlined />}
                className={styles.stat}
              />
            </Space>

            <div className={styles.actionButtons}>
              <Button
                type="primary"
                size="large"
                className={styles.continueButton}
              >
                Continue Learning
              </Button>
              <Button
                size="large"
                style={{ borderColor: "#20B2AA", color: "#20B2AA" }}
              >
                Practice Problems
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
                <Text strong>Learning Level</Text>
                <Text>Intermediate</Text>
              </div>
              <div className={styles.profileStat}>
                <Text strong>Last Active</Text>
                <Text>Today</Text>
              </div>
              <div className={styles.profileStat}>
                <Text strong>Math Points</Text>
                <Text>1,240</Text>
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
                <Button type="link" className={styles.exploreButton}>
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
              <Col xs={24} md={8}>
                <Card className={styles.recTopicCard}>
                  <Title level={5}>Differential Equations</Title>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: "30%" }}
                    ></div>
                    <span className={styles.progressText}>30%</span>
                  </div>
                  <Button type="primary" block>
                    Continue
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className={styles.recTopicCard}>
                  <Title level={5}>Linear Algebra</Title>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: "15%" }}
                    ></div>
                    <span className={styles.progressText}>15%</span>
                  </div>
                  <Button type="primary" block>
                    Start Learning
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className={styles.recTopicCard}>
                  <Title level={5}>Probability Theory</Title>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: "0%" }}
                    ></div>
                    <span className={styles.progressText}>0%</span>
                  </div>
                  <Button type="primary" block>
                    Explore
                  </Button>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default WelcomePage;
