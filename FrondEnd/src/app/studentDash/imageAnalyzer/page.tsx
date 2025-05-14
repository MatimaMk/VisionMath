"use client";
import React, { useState, useRef } from "react";
import { analyzeMathImage } from "../../../components/aiServices/ImageAnalyzer";
import styles from "./styles/imageAnalyzer.module.css";

const MathSolverPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Reference to the file input for triggering via the button
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setError("");
    setAnalysis("");

    if (!selectedImage) {
      setError("Please select or capture an image first.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeMathImage(selectedImage, prompt);
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
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  return (
    <div
      className={styles["min-h-screen"]}
      style={{
        background: "linear-gradient(135deg, #20b2aa 0%, #4ade80 100%)",
      }}
    >
      <div className={styles.container}>
        <h1
          className={`${styles["text-4xl"]} ${styles["font-bold"]} ${styles["text-center"]} ${styles["mb-10"]} ${styles["text-white"]} drop-shadow-lg`}
        >
          Math Problem Solver
        </h1>

        <div
          className={`${styles["max-w-6xl"]} mx-auto ${styles["bg-white"]} ${styles["p-8"]} ${styles["rounded-2xl"]} ${styles["shadow-xl"]} transform hover:scale-[1.01] ${styles["transition-all"]} ${styles["duration-300"]}`}
        >
          <div
            className={`${styles.flex} ${styles["flex-col"]} md:flex-row ${styles["gap-8"]}`}
          >
            {/* Left Column - Image Upload and Preview */}
            <div
              className={`${styles["w-full"]} md:w-2/5 ${styles["space-y-6"]}`}
            >
              <h2
                className={`${styles["text-2xl"]} ${styles["font-bold"]} ${styles["mb-4"]}`}
                style={{ color: "#20b2aa" }}
              >
                Upload Problem
              </h2>
              <div
                className={`${styles.border} ${styles["border-dashed"]} ${
                  styles["rounded-xl"]
                } ${styles["p-6"]} ${styles.flex} ${styles["flex-col"]} ${
                  styles["items-center"]
                } ${styles["justify-center"]} ${
                  styles["h-72"]
                } hover:shadow-inner ${styles["transition-all"]} ${
                  styles["duration-300"]
                } ${styles["cursor-pointer"]} ${styles["overflow-hidden"]} ${
                  imagePreview ? styles["has-image"] : ""
                }`}
                onClick={handleCaptureClick}
                style={{
                  borderColor: "rgba(32, 178, 170, 0.3)",
                  background: "rgba(32, 178, 170, 0.05)",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview of math problem"
                    className={`${styles["max-h-full"]} ${styles["max-w-full"]} ${styles["object-contain"]} ${styles.rounded}`}
                  />
                ) : (
                  <>
                    <div
                      className={`${styles["p-6"]} ${styles["rounded-full"]} ${styles["mb-4"]}`}
                      style={{ background: "rgba(32, 178, 170, 0.1)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${styles["h-16"]} ${styles["w-16"]}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#20b2aa" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`${styles["text-lg"]} ${styles["font-medium"]} ${styles["mb-2"]}`}
                      style={{ color: "#20b2aa" }}
                    >
                      Upload Math Problem
                    </p>
                    <p
                      className={`${styles["text-sm"]} ${styles["text-light"]}`}
                    >
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

              <div className={`${styles.flex} ${styles["space-x-3"]}`}>
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  className={`${styles["flex-1"]} ${styles["px-6"]} ${styles["py-3"]} ${styles["rounded-lg"]} ${styles["font-bold"]} ${styles["text-white"]} ${styles["shadow-md"]} hover:shadow-lg transform hover:-translate-y-1 ${styles["transition-all"]} ${styles["duration-300"]}`}
                  style={{
                    background:
                      "linear-gradient(135deg, #20b2aa 0%, #4ade80 100%)",
                  }}
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
                    className={`${styles["px-6"]} ${styles["py-3"]} ${styles["bg-gray-200"]} ${styles["text-dark"]} ${styles["rounded-lg"]} ${styles["font-medium"]} hover:bg-gray-300 ${styles["transition-all"]} ${styles["duration-300"]}`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Form and Results */}
            <div
              className={`${styles["w-full"]} md:w-3/5 ${styles["space-y-6"]}`}
            >
              <h2
                className={`${styles["text-2xl"]} ${styles["font-bold"]} ${styles["mb-4"]}`}
                style={{ color: "#20b2aa" }}
              >
                Get Solution
              </h2>
              <form onSubmit={handleSubmit} className={styles["space-y-4"]}>
                {/* Optional: Add a prompt input field */}
                <div className={styles["mb-4"]}>
                  <label
                    htmlFor="prompt"
                    className={`${styles.block} ${styles["text-sm"]} ${styles["font-medium"]} ${styles["mb-2"]}`}
                    style={{ color: "#20b2aa" }}
                  >
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., 'Find the derivative of this function' or 'Solve this equation'"
                    className={`${styles["w-full"]} ${styles["p-3"]} ${styles.border} ${styles["border-gray-300"]} ${styles["rounded-lg"]} focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !selectedImage}
                  className={`${styles["w-full"]} ${styles["px-6"]} ${
                    styles["py-4"]
                  } ${styles["rounded-lg"]} ${styles["font-bold"]} ${
                    styles["text-white"]
                  } ${styles["shadow-md"]} ${styles["transition-all"]} ${
                    styles["duration-300"]
                  } ${
                    isLoading || !selectedImage
                      ? styles["bg-gray-300"] +
                        " " +
                        styles["cursor-not-allowed"]
                      : "hover:shadow-lg transform hover:-translate-y-1"
                  }`}
                  style={
                    isLoading || !selectedImage
                      ? {}
                      : {
                          background:
                            "linear-gradient(135deg, #20b2aa 0%, #4ade80 100%)",
                        }
                  }
                >
                  {isLoading ? (
                    <span
                      className={`${styles.flex} ${styles["items-center"]} ${styles["justify-center"]}`}
                    >
                      <svg
                        className={`${styles["animate-spin"]} ${styles["-ml-1"]} ${styles["mr-3"]} ${styles["h-5"]} ${styles["w-5"]} ${styles["text-white"]}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Solving Problem...
                    </span>
                  ) : (
                    "Solve Problem"
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div
                  className={`${styles["p-4"]} ${styles["bg-error-light"]} ${styles["border-l-4"]} ${styles["border-error"]} ${styles["rounded-lg"]} ${styles["shadow-sm"]}`}
                >
                  <p
                    className={`${styles["text-error"]} ${styles["font-medium"]}`}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* Analysis Result */}
              {analysis && (
                <div
                  className={`${styles["p-6"]} ${styles.border} ${styles["rounded-xl"]} ${styles["bg-white"]} ${styles["shadow-lg"]} ${styles["max-h-60"]} ${styles["overflow-y-auto"]}`}
                >
                  <h2
                    className={`${styles["text-2xl"]} ${styles["font-bold"]} ${styles["mb-4"]}`}
                    style={{ color: "#20b2aa" }}
                  >
                    Solution
                  </h2>
                  <div className={styles["max-w-none"]}>
                    {analysis.split("\n").map((line, index) => (
                      <p
                        key={index}
                        className={
                          line.toLowerCase().includes("final answer")
                            ? `${styles["font-bold"]} ${styles["p-4"]} ${styles["my-3"]} ${styles["bg-success-light"]} ${styles["border-l-4"]} ${styles["border-success"]} ${styles["rounded-lg"]} ${styles["shadow-sm"]}`
                            : styles["my-2"]
                        }
                      >
                        {line}
                      </p>
                    ))}
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
