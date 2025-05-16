"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../aiTestGenerator/styles/mathTest.module.css";
import ResultSummary from "../aiServices/resultsSummary";
import { TestResult } from "../../app/interfaces/mathTestTypes";

interface Props {
  result: TestResult;
}

export default function TestResultsClient({ result }: Props) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <div className={styles.resultsTabs}>
        <button
          onClick={() => setActiveTab("overview")}
          className={`${styles.resultTab} ${
            activeTab === "overview" ? styles.activeTab : ""
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`${styles.resultTab} ${
            activeTab === "questions" ? styles.activeTab : ""
          }`}
        >
          Question Review
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`${styles.resultTab} ${
            activeTab === "recommendations" ? styles.activeTab : ""
          }`}
        >
          Recommendations
        </button>
      </div>

      <div className={styles.resultsContent}>
        {activeTab === "overview" && <ResultSummary result={result} />}

        {activeTab === "questions" && (
          <div className={styles.questionReview}>
            <h2 className={styles.reviewTitle}>Question Review</h2>

            {result.questions.map((question, index) => (
              <div
                key={question.id}
                className={`${styles.reviewQuestion} ${
                  question.isCorrect
                    ? styles.correctQuestion
                    : styles.incorrectQuestion
                }`}
              >
                <div className={styles.reviewHeader}>
                  <h3 className={styles.reviewQuestionTitle}>
                    Question {index + 1}
                  </h3>
                  <span className={styles.reviewStatus}>
                    {question.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <p className={styles.reviewQuestionText}>{question.text}</p>

                <div className={styles.answerComparison}>
                  <div className={styles.answerColumn}>
                    <h4 className={styles.answerTitle}>Your Answer:</h4>
                    <div className={styles.answerBox}>
                      {question.userAnswer || (
                        <span className={styles.noAnswer}>
                          (No answer provided)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.answerColumn}>
                    <h4 className={styles.answerTitle}>Correct Answer:</h4>
                    <div className={styles.answerBox}>
                      {question.correctAnswer}
                    </div>
                  </div>
                </div>

                {question.explanation && (
                  <div className={styles.explanation}>
                    <h4 className={styles.explanationTitle}>Explanation:</h4>
                    <p className={styles.explanationText}>
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className={styles.recommendationsTab}>
            <h2 className={styles.recommendationsTitle}>
              Personalized Recommendations
            </h2>
            <p className={styles.recommendationsIntro}>
              Based on your performance, our AI has generated these tailored
              suggestions to help you improve your understanding of the topic:
            </p>

            <div className={styles.recommendationsList}>
              {result.recommendations.map((rec, index) => (
                <div key={index} className={styles.recommendationItem}>
                  <h3 className={styles.recommendationItemTitle}>
                    {rec.title}
                  </h3>
                  <p className={styles.recommendationItemText}>
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.nextStepsSection}>
              <h3 className={styles.nextStepsTitle}>Next Steps</h3>
              <div className={styles.nextStepsCards}>
                <div className={styles.nextStepCard}>
                  <h4>Take Another Test</h4>
                  <p>
                    Try a different topic or difficulty level to expand your
                    skills.
                  </p>
                  <Link href="/math-tests" className={styles.nextStepButton}>
                    New Test
                  </Link>
                </div>

                <div className={styles.nextStepCard}>
                  <h4>Practice This Topic</h4>
                  <p>
                    Strengthen your understanding with more practice in{" "}
                    {result.math_tests?.topic || result.topic || "this topic"}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
