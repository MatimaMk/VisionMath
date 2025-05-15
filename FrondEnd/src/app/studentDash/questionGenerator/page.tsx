"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "./styles/question.module.css";

interface Question {
  question: string;
  answer: string;
  solution: string;
}

interface TestData {
  questions: Question[];
}

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("No file selected");
  const [isLoading] = useState<boolean>(false);
  const [testData] = useState<TestData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError(null);
      } else {
        setError("Please upload a PDF file");
        setFile(null);
        setFileName("No file selected");
      }
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("pages/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data.error);
        alert(`Error: ${data.error}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network or server error");
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Mathematics Test Generator</title>
        <meta
          name="description"
          content="Generate math tests from PDF content using Gemini AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Mathematics Test Generator</h1>
        <p className={styles.description}>
          Upload a mathematics PDF to generate test questions and answers
        </p>

        <div className={styles.uploadSection}>
          <form onSubmit={handleSubmit} className={styles.uploadForm}>
            <div className={styles.fileUpload}>
              <label htmlFor="pdf-file" className={styles.fileLabel}>
                <span className={styles.icon}>📄</span>
                <span className={styles.labelText}>Choose PDF file</span>
              </label>
              <input
                type="file"
                id="pdf-file"
                onChange={handleFileChange}
                accept=".pdf"
                required
                className={styles.fileInput}
              />
              <span className={styles.fileName}>{fileName}</span>
            </div>
            <button
              type="submit"
              className={styles.uploadBtn}
              disabled={isLoading || !file}
            >
              Generate Test
            </button>
          </form>

          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Processing your PDF with Gemini AI...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}
        </div>

        {testData && (
          <div className={styles.resultsSection}>
            <h2>Generated Mathematics Test</h2>
            <div className={styles.testContent}>
              {testData.questions.map((question, index) => (
                <div key={index} className={styles.questionCard}>
                  <h3>Question {index + 1}</h3>
                  <div className={styles.questionText}>{question.question}</div>

                  <div className={styles.answerSection}>
                    <h4>Answer:</h4>
                    <div className={styles.answer}>{question.answer}</div>
                  </div>

                  <div className={styles.solutionSection}>
                    <h4>Solution:</h4>
                    <div className={styles.solution}>{question.solution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by Next.js, TypeScript, and Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default Home;
