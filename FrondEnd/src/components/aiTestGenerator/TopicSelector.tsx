"use client";
import React from "react";
import styles from "../aiTestGenerator/styles/mathTest.module.css";

interface TopicSelectorProps {
  topic: string;
  setTopic: (topic: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  onSubmit,
  isLoading,
}) => {
  const topics = [
    "Algebra",
    "Calculus",
    "Geometry",
    "Trigonometry",
    "Statistics",
    "Probability",
    "Number Theory",
    "Linear Algebra",
  ];

  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (topic) {
      onSubmit();
    }
  };

  return (
    <form className={styles.topicForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="topic" className={styles.formLabel}>
          Select a Mathematics Topic:
        </label>
        <select
          id="topic"
          className={styles.formSelect}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="">-- Select Topic --</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="difficulty" className={styles.formLabel}>
          Difficulty Level:
        </label>
        <div className={styles.difficultySelectors}>
          {difficultyLevels.map((level) => (
            <label key={level.value} className={styles.difficultyLabel}>
              <input
                type="radio"
                name="difficulty"
                value={level.value}
                checked={difficulty === level.value}
                onChange={() => setDifficulty(level.value)}
                disabled={isLoading}
                className={styles.difficultyRadio}
              />
              <span
                className={`${styles.difficultyOption} ${styles[level.value]}`}
              >
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="questionCount" className={styles.formLabel}>
          Number of Questions:{" "}
          <span className={styles.questionCount}>{questionCount}</span>
        </label>
        <input
          type="range"
          id="questionCount"
          min="3"
          max="10"
          step="1"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          disabled={isLoading}
          className={styles.rangeSlider}
        />
        <div className={styles.rangeLabels}>
          <span>3</span>
          <span>5</span>
          <span>7</span>
          <span>10</span>
        </div>
      </div>

      <button
        type="submit"
        className={styles.generateButton}
        disabled={!topic || isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner}></span>
            Generating...
          </>
        ) : (
          "Generate Test"
        )}
      </button>
    </form>
  );
};
