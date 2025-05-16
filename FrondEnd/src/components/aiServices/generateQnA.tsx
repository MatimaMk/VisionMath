import { MathQuestion, MathQuestionPDF } from "@/app/interfaces/mathTestTypes";
import { QuestionType } from "@/app/interfaces/mathTestTypes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import type { NextApiRequest } from "next";
import { v4 as uuidv4 } from "uuid";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiKey = "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

export function parseForm(
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text || "";
  } finally {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }
}

export async function generateMathTest(
  pdfContent: string
): Promise<MathQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
You are an AI tutor. Based on the following mathematics content, generate a test with 5 well-structured questions. 
Each question must have:
1. A problem statement.
2. The correct answer.
3. A step-by-step solution.

Use this structure:
{
  "questions": [
    {
      "question": "Question text here",
      "answer": "Answer here",
      "solution": "Step-by-step solution"
    }
  ]
}

DO NOT add any explanations outside of the JSON. Respond with **valid JSON only**.

Mathematics content:
${pdfContent.substring(0, 10000)}
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/^\s*{[\s\S]*}\s*$/m);
    const rawQuestions: MathQuestionPDF[] = jsonMatch
      ? JSON.parse(jsonMatch[0]).questions
      : JSON.parse(text).questions;

    const structuredQuestions: MathQuestion[] = rawQuestions.map((q) => ({
      id: uuidv4(),
      text: q.question,
      type: "open_ended", // Or "multiple_choice" based on your logic
      QuestionType: QuestionType.ShortAnswer, // Or infer based on question content
      correctAnswer: q.answer,
      explanation: q.solution,
    }));

    return structuredQuestions;
  } catch (e) {
    console.error("Gemini generation error:", e);
    throw new Error("AI generation failed");
  }
}
