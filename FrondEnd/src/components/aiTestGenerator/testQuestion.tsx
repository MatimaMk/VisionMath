import React from "react";
import styles from "../aiTestGenerator/styles/mathTest.module.css";
import { ClientMathQuestion } from "../../app/interfaces/mathTestTypes";

interface TestQuestionProps {
  question: ClientMathQuestion;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: string;
  onAnswerChange: (questionId: string, value: string) => void;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  isActive,
  onNext,
  onPrevious,
  onSubmit,
  isLastQuestion,
  isSubmitting,
}) => {
  if (!isActive) return null;

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionHeader}>
        <h2 className={styles.questionTitle}>
          Question {questionNumber} of {totalQuestions}
        </h2>
        <span className={styles.questionType}>
          {question.type === "multiple_choice"
            ? "Multiple Choice"
            : "Open Ended"}
        </span>
      </div>

      <p className={styles.questionText}>{question.text}</p>

      {question.type === "multiple_choice" && question.options ? (
        <div className={styles.choices}>
          {question.options.map((option, index) => (
            <label key={index} className={styles.choiceLabel}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={userAnswer === option}
                onChange={() => onAnswerChange(question.id, option)}
                className={styles.choiceInput}
              />
              <span className={styles.choiceText}>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className={styles.answerInputContainer}>
          <textarea
            placeholder="Enter your answer here..."
            value={userAnswer || ""}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            className={styles.answerTextarea}
            rows={4}
          />
        </div>
      )}

      <div className={styles.questionNavigation}>
        {questionNumber > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            className={styles.navButton}
          >
            Previous
          </button>
        )}

        <div className={styles.navSpacer}></div>

        {!isLastQuestion ? (
          <button type="button" onClick={onNext} className={styles.navButton}>
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className={`${styles.navButton} ${styles.submitButton}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestQuestion;
