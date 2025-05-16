"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { mathTestService } from "../../../components/aiServices/mathTestService";
import { TopicSelector } from "../../../components/aiTestGenerator/TopicSelector";
import MathTestCard from "../../../components/aiTestGenerator/mathTestCard";
import styles from "../../../components/aiTestGenerator/styles/mathTest.module.css";
import { TestResult } from "../../interfaces/mathTestTypes";

const MathTests: NextPage = () => {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setRetryCount] = useState(0);

  // Load user's test history
  useEffect(() => {
    async function loadTestHistory() {
      try {
        const history = await mathTestService.getTestHistory();
        setTestHistory(history);
      } catch (err) {
        console.error("Error loading test history:", err);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadTestHistory();
  }, []);

  const handleGenerateTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const test = await mathTestService.generateTest(
        topic,
        difficulty,
        questionCount
      );

      if (test && test.id) {
        router.push(`/studentDash/aiTakeTest?testId=${test.id}`);
      } else {
        throw new Error("Invalid test data returned");
      }
    } catch (err: unknown) {
      console.error("Error generating test:", err);

      if (err instanceof Error) {
        if (err.message.includes("Failed to send a request")) {
          setError(
            "Unable to connect to the test generator service. Please check your internet connection and try again."
          );
        } else if (err.message.includes("timeout")) {
          setError(
            "The request took too long to process. Please try again with simpler parameters."
          );
        } else {
          setError(
            `Failed to generate test: ${err.message}. Please try again.`
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to retry after failure
  const handleRetry = () => {
    setRetryCount((prevCount) => prevCount + 1);
    handleGenerateTest();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Math Test Generator</title>
        <meta
          name="description"
          content="Generate personalized math tests powered by AI"
        />
      </Head>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <h1 className={styles.title}>Math Test Generator</h1>
          <p className={styles.subtitle}>
            Empower your intelligence through mathematics—AI transforming logic
            into limitless possibilities, unlocking the future of innovation and
            discovery.
          </p>
        </section>

        <section className={styles.generatorSection}>
          <h2 className={styles.sectionTitle}>Create a New Test</h2>
          <TopicSelector
            topic={topic}
            setTopic={setTopic}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            onSubmit={handleGenerateTest}
            isLoading={loading}
          />

          {error && (
            <div className={styles.errorAlert}>
              <p>{error}</p>
              <button
                onClick={handleRetry}
                className={styles.retryButton}
                disabled={loading}
              >
                Try Again
              </button>
            </div>
          )}
        </section>

        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>Your Test History</h2>

          {historyLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading test history...</p>
            </div>
          ) : testHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                You haven&rsquo;t taken any tests yet. Create your first test
                above!
              </p>
            </div>
          ) : (
            <div className={styles.testGrid}>
              {testHistory.map((test) => (
                <MathTestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </section>

        <section className={styles.featureSection}>
          <h2 className={styles.sectionTitle}>Features</h2>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI-Generated Questions</h3>
              <p>
                Unique questions created by AI, tailored to your selected topic
                and difficulty.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏱️</div>
              <h3>Time Tracking</h3>
              <p>
                Monitor your speed and efficiency as you complete each test.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Instant Feedback</h3>
              <p>
                Get immediate grading and detailed explanations for each
                question.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Personalized Recommendations</h3>
              <p>
                Receive tailored learning suggestions based on your performance.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MathTests;
