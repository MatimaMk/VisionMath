"use client";

import { difficultLevel } from "@/enums/difficultLevel";
import { questionTypes } from "@/enums/questionTypes";
import { createContext } from "react";

export interface IcreateTest {
  title?: string;
  description?: string;
  timeLimitMinutes?: Date;
  difficultyLevel?: difficultLevel;
  passingPercentage?: number;
  instructions?: string;
  questions?: IQuestion[];
}
export interface IQuestion {
  questionText?: string;
  questionType?: questionTypes;
  questionPoints?: number;
  solutionExplanation?: string;
  questionOptions?: IQuestionOption[];
}

export interface IQuestionOption {
  optionText?: string;
  isCorrect?: boolean;
  orderNumber?: number;
  explanation?: string;
}

export interface ITestStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  test?: IcreateTest;
  tests?: IcreateTest[];
  question?: IQuestion;
  questions?: IQuestion[];
  questionOption?: IQuestionOption;
  questionOptions?: IQuestionOption[];
}

// Initial state with default values
export const INITIAL_STATE: ITestStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  tests: [],
  questions: [],
  questionOptions: [],
};

export interface ITestActionContext {
  createTest: (test: IcreateTest) => void;
  getAllTests: () => void;
  getTestWithQuestions: (id: string) => void;
  updateTest: (test: IcreateTest) => void;
  deleteTest: (id: string) => void;
  submitTestAnswers: () => void;
}

export const TestStateContext = createContext<ITestStateContext>(INITIAL_STATE);
export const TestActionContext = createContext<ITestActionContext | undefined>(
  undefined
);
