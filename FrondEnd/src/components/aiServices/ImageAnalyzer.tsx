import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCoXN7igeh_bDJ5k6B-Hw0JvzU5yTRjTHI";
const genAI = new GoogleGenerativeAI(apiKey || "");

export const getImageData = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeMathImage = async (
  imageFile: File,
  contextPrompt: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageData = await getImageData(imageFile);

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: imageFile.type,
      },
    };

    const promptText = `
      Solve the following mathematical problem step by step, showing all necessary workings.
      Additional context: ${contextPrompt}

      Important notes:
      - Break the solution into clear, logical steps
      - Make it relatable and logical
      - Explain each step as if teaching a student
      - Use proper mathematical notation and formatting
      - Mention alternative methods if applicable
      - Clearly format any section headers like "Step 1" or "Understanding the Problem" for easy readability
      - When presenting the final answer, start with "Final Answer:" and make it very clear
      
      Format the solution for easy readability. Don't use asterisks or markdown formatting like ** for emphasis.
      Use clear section headers for each step.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }, imagePart],
        },
      ],
    });

    return result.response.text();
  } catch (error: unknown) {
    console.error("Error analyzing image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to analyze image: ${errorMessage}`);
  }
};
