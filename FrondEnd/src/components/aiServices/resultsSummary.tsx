import React from "react";
import Link from "next/link";
import styles from "../aiTestGenerator/styles/mathTest.module.css";
import { TestResult } from "../../app/interfaces/mathTestTypes";

interface ResultSummaryProps {
  result: TestResult;
}
const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const formatTime = (seconds?: number): string => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${
      secs !== 1 ? "s" : ""
    }`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return styles.excellent;
    if (score >= 70) return styles.good;
    if (score >= 50) return styles.average;
    return styles.poor;
  };

  const getCorrectCount = (): number => {
    return result.questions.filter((q) => q.isCorrect).length;
  };

  const getAverageTimePerQuestion = (): number => {
    return Math.round(result.time_in_seconds / result.questions.length);
  };

  if (!result) return null;

  return (
    <div className={styles.resultSummary}>
      <div className={styles.scoreSection}>
        <div className={styles.scoreCard}>
          <h2 className={styles.scoreTitle}>Your Score</h2>
          <div
            className={`${styles.scoreValue} ${getScoreColor(result.score)}`}
          >
            {result.score}%
          </div>
          <p className={styles.scoreDetail}>
            {getCorrectCount()} out of {result.questions.length} questions
            correct
          </p>
        </div>

        <div className={styles.timeCard}>
          <h2 className={styles.timeTitle}>Time Stats</h2>
          <div className={styles.timeDetails}>
            <div className={styles.timeStat}>
              <span className={styles.timeLabel}>Total Time:</span>
              <span className={styles.timeValue}>
                {formatTime(result.time_in_seconds)}
              </span>
            </div>
            <div className={styles.timeStat}>
              <span className={styles.timeLabel}>Avg. Time per Question:</span>
              <span className={styles.timeValue}>
                {getAverageTimePerQuestion()} seconds
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recommendationsSection}>
        <h2 className={styles.recommendationsTitle}>
          Personalized Recommendations
        </h2>
        <div className={styles.recommendationsList}>
          {result.recommendations.map((rec, index) => (
            <div key={index} className={styles.recommendationCard}>
              <h3 className={styles.recommendationTitle}>{rec.title}</h3>
              <p className={styles.recommendationText}>{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.resultsActions}>
        <Link href="/math-tests">
          <a className={styles.actionButton}>Take Another Test</a>
        </Link>
        <button
          className={`${styles.actionButton} ${styles.shareButton}`}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Results link copied to clipboard!");
          }}
        >
          Share Results
        </button>
      </div>
    </div>
  );
};

export default ResultSummary;
