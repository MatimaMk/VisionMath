"use client";
import React, { useState, useRef } from "react";
import { analyzeMathImage } from "../../../components/aiServices/ImageAnalyzer";
import "./styles/imageAnalyzer.module.css";

const MathSolverPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt] = useState<string>("");
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

    // Reseting of the states
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
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #20b2aa 0%, #4ade80 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-white drop-shadow-lg">
          Math Problem Solver
        </h1>

        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Image Upload and Preview */}
            <div className="w-full md:w-2/5 space-y-6">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#20b2aa" }}
              >
                Upload Problem
              </h2>
              <div
                className="border-3 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-72 hover:shadow-inner transition-all duration-300 cursor-pointer overflow-hidden"
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
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <>
                    <div
                      className="p-6 rounded-full mb-4"
                      style={{ background: "rgba(32, 178, 170, 0.1)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
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
                      className="text-lg font-medium mb-2"
                      style={{ color: "#20b2aa" }}
                    >
                      Upload Math Problem
                    </p>
                    <p className="text-sm text-gray-500">
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
                className="hidden"
                title="Upload an image file"
              />

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCaptureClick}
                  className="flex-1 px-6 py-3 rounded-lg font-bold text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
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
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Form and Results */}
            <div className="w-full md:w-3/5 space-y-6">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#20b2aa" }}
              >
                Get Solution
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || !selectedImage}
                  className={`w-full px-6 py-4 rounded-lg font-bold text-white shadow-md transition-all duration-300 ${
                    isLoading || !selectedImage
                      ? "bg-gray-300 cursor-not-allowed"
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
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Analysis Result */}
              {analysis && (
                <div className="p-6 border rounded-xl bg-white shadow-lg max-h-[500px] overflow-y-auto">
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: "#20b2aa" }}
                  >
                    Solution
                  </h2>
                  <div className="prose max-w-none">
                    {analysis.split("\n").map((line, index) => (
                      <p
                        key={index}
                        className={
                          line.toLowerCase().includes("final answer")
                            ? "font-bold p-4 my-3 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm"
                            : "my-2"
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
