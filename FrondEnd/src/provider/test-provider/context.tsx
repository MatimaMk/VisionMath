"use client";

import { difficultLevel } from "@/enums/difficultLevel";
import { questionTypes } from "@/enums/questionTypes";
import { createContext } from "react";

// Base Types
export interface QuestionOptionDto {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  orderNumber: number;
  explanation?: string;
}
export interface TestDetailsFormValues {
  title: string;
  description: string;
  timeLimitMinutes: string;
  difficultyLevel: difficultLevel;
  passingPercentage: number;
  attempts?: number;
  instructions: string;
}

export interface QuestionDto {
  id?: string;
  questionText: string;
  questionType: questionTypes;
  questionPoints: number;
  solutionExplanation: string;
  questionOptions?: QuestionOptionDto[];
}

export interface TestDto {
  id?: string;
  title: string;
  description: string;
  timeLimitMinutes: string;
  difficultyLevel: difficultLevel;
  passingPercentage: number;
  instructions: string;
  attempts?: number;
  questions?: QuestionDto[];
  creationTime?: string;
}

// Create DTOs
export interface CreateQuestionOptionDto {
  optionText?: string;
  isCorrect: boolean;
  orderNumber: number;
  explanation?: string;
}

export interface CreateQuestionDto {
  questionText: string;
  questionType: questionTypes;
  questionPoints: number;
  solutionExplanation: string;
  questionOptions: CreateQuestionOptionDto[];
}

export interface CreateTestDto {
  title: string;
  description: string;
  timeLimitMinutes: string;
  difficultyLevel: difficultLevel;
  passingPercentage: number;
  instructions: string;
  questions: CreateQuestionDto[];
}

// Update DTOs
export interface UpdateQuestionOptionDto {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  orderNumber: number;
  explanation?: string;
}

export interface UpdateQuestionDto {
  id?: string;
  questionText: string;
  questionType: questionTypes;
  questionPoints: number;
  solutionExplanation: string;
  questionOptions: UpdateQuestionOptionDto[];
}

export interface UpdateTestDto {
  id?: string;
  title: string;
  description: string;
  timeLimitMinutes: string;
  difficultyLevel: difficultLevel;
  passingPercentage: number;
  instructions: string;
  questions: UpdateQuestionDto[];
}

// Test submission types
export interface SubmitTestAnswersDto {
  testId: string;
  answers: SubmitAnswerDto[];
}

export interface SubmitAnswerDto {
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  numericAnswer?: number;
}

export interface SubmitTestResultDto {
  testId: string;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
}

// This extends TestDto but guarantees questions array exists
export interface TestWithQuestionsDto extends TestDto {
  questions: QuestionDto[];
}

// State interface - using TestDto to match what we get from backend
export interface ITestStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  test?: TestDto; // Changed from TestWithQuestionsDto to TestDto
  tests?: TestDto[];
  submissionResult?: SubmitTestResultDto;
  testWithQuestions?: TestWithQuestionsDto;
}

// Initial state with default values
export const INITIAL_STATE: ITestStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  tests: [],
};

export interface ITestActionContext {
  createTest: (test: CreateTestDto) => Promise<void>;
  getAllTests: () => Promise<void>;
  getTestWithQuestions: (id: string) => Promise<void>;
  updateTest: (test: UpdateTestDto) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
  submitTestAnswers: (answers: SubmitTestAnswersDto) => Promise<void>;
}

export const TestStateContext = createContext<ITestStateContext>(INITIAL_STATE);
export const TestActionContext = createContext<ITestActionContext | undefined>(
  undefined
);
