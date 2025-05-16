"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";

import TestQuestion from "../../../components/aiTestGenerator/testQuestion";
import { mathTestService } from "../../../components/aiServices/mathTestService";
import { supabase } from "../../../lib/supabase";
import {
  ClientMathTest,
  AnswersMap,
  MathQuestion,
} from "../../interfaces/mathTestTypes";
import styles from "../../../components/aiTestGenerator/styles/mathTest.module.css";
import Link from "next/link";

// Loading component for Suspense fallback
const LoadingUI = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
    <p>Loading your test...</p>
  </div>
);

// Component that uses useSearchParams, wrapped in Suspense in the parent
function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  const [test, setTest] = useState<ClientMathTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (testId) {
      loadTest();
    } else {
      setLoading(false);
      setError("No test ID provided");
    }
  }, [testId, searchParams]);

  // Setup timer
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const loadTest = async () => {
    setLoading(true);
    try {
      if (!testId) {
        throw new Error("Invalid test ID");
      }

      // Get test from Supabase using the testId
      const { data: testData, error: testError } = await supabase
        .from("math_tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (testError) throw new Error(testError.message);
      if (!testData) throw new Error("Test not found");

      // Parse questions and remove answers for client-side
      const questions = testData.questions.map((q: MathQuestion) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options || [],
      }));

      const clientTest: ClientMathTest = {
        id: testData.id,
        title: testData.title,
        topic: testData.topic,
        difficulty: testData.difficulty,
        questions,
        userId: testData.userId,
      };

      setTest(clientTest);
      setAnswers({});
      setStartTime(Date.now());
      setCurrentQuestion(0);
    } catch (err: unknown) {
      console.error("Error loading test:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNextQuestion = () => {
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion((current) => current + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((current) => current - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    setSubmitting(true);

    try {
      if (!test) throw new Error("No test data available");

      const result = await mathTestService.submitTest(
        test.id,
        answers,
        elapsedTime
      );

      // Router navigation
      router.push(`/studentDash/aiResults?resultsId=${result.resultId}`);
    } catch (err: unknown) {
      console.error("Error submitting test:", err);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    if (!test) return 0;
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / test.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your test...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops! Something went wrong</h2>
        <p className={styles.errorMessage}>{error}</p>
        <Link href="/studentDash/mathTest" className={styles.returnButton}>
          Return to Math Tests
        </Link>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{test.topic} Math Test</title>
        <meta
          name="description"
          content={`Taking a ${test.difficulty} test on ${test.topic}`}
        />
      </Head>

      <header className={styles.testHeader}>
        <div className={styles.testInfo}>
          <h1 className={styles.testTitle}>{test.title}</h1>
          <div className={styles.testMeta}>
            <span className={styles.testTopic}>{test.topic}</span>
            <span
              className={`${styles.testDifficulty} ${styles[test.difficulty]}`}
            >
              {test.difficulty.charAt(0).toUpperCase() +
                test.difficulty.slice(1)}
            </span>
          </div>
        </div>

        <div className={styles.testProgress}>
          <div className={styles.timer}>
            <span className={styles.timerIcon}>⏱️</span>
            <span className={styles.timerValue}>{formatTime(elapsedTime)}</span>
          </div>

          <div className={styles.progressInfo}>
            <div className={styles.progressText}>
              Question {currentQuestion + 1} of {test.questions.length}
              <span className={styles.progressPercentage}>
                {getProgressPercentage()}% answered
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.testMain}>
        {test.questions && test.questions.length > 0 ? (
          test.questions.map((question, index) => (
            <TestQuestion
              key={question.id}
              question={question}
              questionNumber={index + 1}
              totalQuestions={test.questions.length}
              userAnswer={answers[question.id] || ""}
              onAnswerChange={handleAnswerChange}
              isActive={index === currentQuestion}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              onSubmit={handleSubmitTest}
              isLastQuestion={index === test.questions.length - 1}
              isSubmitting={submitting}
            />
          ))
        ) : (
          <div>
            No questions to display. Questions count:{" "}
            {test?.questions?.length || 0}
          </div>
        )}

        <div className={styles.testActions}>
          <button
            onClick={handleSubmitTest}
            className={styles.submitTestButton}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </main>
    </div>
  );
}

// Main component with Suspense boundary
const TakeTest = () => {
  return (
    <Suspense fallback={<LoadingUI />}>
      <TestContent />
    </Suspense>
  );
};

export default TakeTest;
