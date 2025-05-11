"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITestStateContext } from "./context";

export const TestReducer = handleActions<ITestStateContext, ITestStateContext>(
  {
    //Create Test
    createTestPending: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    createTestSuccess: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    createTestError: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Get All Tests
    getAllTestsPending: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    getAllTestsSuccess: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    getAllTestsError: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Get Test with Questions
    getTestWithQuestionsPending: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    getTestWithQuestionsSuccess: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    getTestWithQuestionsError: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Update Test
    updateTestPending: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    updateTestSuccess: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    updateTestError: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Delete Test
    deleteTestPending: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    deleteTestSuccess: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    deleteTestError: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Submit Test Answer
    submitTestAnswerPending: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    submitTestAnswerSuccess: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    submitTestAnswerError: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
