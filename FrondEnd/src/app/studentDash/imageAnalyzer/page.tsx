"use client";
import React, { useState, useRef } from "react";
import { analyzeMathImage } from "../../../components/aiServices/ImageAnalyzer";
import styles from "./styles/imageAnalyzer.module.css";

const MathSolverPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reference to the file input for triggering via the button
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    // Reset states
    setError("");
    setAnalysis("");

    if (!selectedImage) {
      setError("Please select or capture an image first.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeMathImage(selectedImage, "");
      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger the file input to open the camera
  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Math Problem Solver</h1>

        <div className={styles.card}>
          <div className={styles.flexContainer}>
            {/* Left Column - Image Upload and Preview */}
            <div className={styles.leftCol}>
              <h2 className={styles.sectionTitle}>Upload Problem</h2>

              <div
                className={`${styles.uploadBox} ${
                  imagePreview ? styles.hasImage : ""
                }`}
                onClick={handleCaptureClick}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview of math problem"
                    className={styles.previewImage}
                  />
                ) : (
                  <>
                    <div className={styles.iconContainer}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.uploadIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className={styles.uploadText}>Upload Math Problem</p>
                    <p className={styles.uploadSubtext}>
                      Click to capture or select an image
                    </p>
                  </>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                id="upload"
                name="upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.hidden}
                title="Upload an image file"
              />

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  className={styles.primaryButton}
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className={styles.secondaryButton}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Form and Results */}
            <div className={styles.rightCol}>
              <h2 className={styles.sectionTitle}>Get Solution</h2>

              <div className={styles.formContainer}>
                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSolve}
                  disabled={isLoading || !selectedImage}
                  className={`${styles.submitButton} ${
                    isLoading || !selectedImage ? styles.disabled : ""
                  }`}
                >
                  {isLoading ? (
                    <span className={styles.loaderContainer}>
                      <svg
                        className={styles.spinner}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className={styles.spinnerBackground}
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className={styles.spinnerForeground}
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Solving...
                    </span>
                  ) : (
                    "Solve Problem"
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className={styles.errorContainer}>
                  <p className={styles.errorText}>{error}</p>
                </div>
              )}

              {/* Analysis Result */}
              {analysis && (
                <div className={styles.resultContainer}>
                  <div className={styles.resultHeader}>
                    <h3 className={styles.resultTitle}>Solution</h3>
                  </div>
                  <div className={styles.resultContent}>
                    {analysis.split("\n").map((line, index) => {
                      // Check if line contains headings or important sections
                      const isUnderstanding =
                        line.toLowerCase().includes("understanding") ||
                        line.toLowerCase().includes("step 1");
                      const isStep =
                        line.toLowerCase().includes("step") &&
                        !line.toLowerCase().includes("step 1");
                      const isFinalAnswer = line
                        .toLowerCase()
                        .includes("final answer");

                      let className = styles.resultLine;
                      if (isUnderstanding) className = styles.understandingLine;
                      if (isStep) className = styles.stepLine;
                      if (isFinalAnswer) className = styles.finalAnswer;

                      return (
                        <p key={index} className={className}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathSolverPage;
