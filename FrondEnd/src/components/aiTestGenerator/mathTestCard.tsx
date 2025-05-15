// components/MathTestCard.tsx
import React from "react";
import Link from "next/link";
import styles from "../aiTestGenerator/styles/mathTest.module.css";
import { TestResult } from "../../app/interfaces/mathTestTypes";

interface MathTestCardProps {
  test: TestResult;
}

const MathTestCard: React.FC<MathTestCardProps> = ({ test }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds?: number): string => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score?: number): string => {
    if (!score) return "";
    if (score >= 90) return styles.excellent;
    if (score >= 70) return styles.good;
    if (score >= 50) return styles.average;
    return styles.poor;
  };

  const getDifficultyClass = (difficulty?: string): string => {
    if (!difficulty) return "";
    return styles[difficulty as "easy" | "medium" | "hard"] || "";
  };

  return (
    <div className={styles.testCard}>
      <div className={styles.testCardHeader}>
        <h3 className={styles.testCardTitle}>
          {test.math_tests?.title || test.topic || "Math Test"}
        </h3>
        <span
          className={`${styles.testCardBadge} ${getDifficultyClass(
            test.math_tests?.difficulty || test.difficulty
          )}`}
        >
          {test.math_tests?.difficulty || test.difficulty || "Medium"}
        </span>
      </div>

      <div className={styles.testCardBody}>
        <div className={styles.testCardDetail}>
          <span className={styles.testCardLabel}>Topic:</span>
          <span className={styles.testCardValue}>
            {test.math_tests?.topic || test.topic}
          </span>
        </div>

        {test.score !== undefined && (
          <div className={styles.testCardDetail}>
            <span className={styles.testCardLabel}>Score:</span>
            <span
              className={`${styles.testCardValue} ${getScoreColor(test.score)}`}
            >
              {test.score}%
            </span>
          </div>
        )}

        {test.time_in_seconds && (
          <div className={styles.testCardDetail}>
            <span className={styles.testCardLabel}>Time:</span>
            <span className={styles.testCardValue}>
              {formatTime(test.time_in_seconds)}
            </span>
          </div>
        )}

        {test.completed_at && (
          <div className={styles.testCardDetail}>
            <span className={styles.testCardLabel}>Completed:</span>
            <span className={styles.testCardValue}>
              {formatDate(test.completed_at)}
            </span>
          </div>
        )}
      </div>

      <div className={styles.testCardFooter}>
        {test.id && test.score !== undefined && (
          <Link
            href={`/studendDash/aiResults/results?testId=${test.id}`}
            className={styles.testCardLink}
          >
            View Results
          </Link>
        )}
      </div>
    </div>
  );
};

export default MathTestCard;
