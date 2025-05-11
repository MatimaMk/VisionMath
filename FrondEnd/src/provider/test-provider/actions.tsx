"use client";

import { TestDto, TestWithQuestionsDto, SubmitTestResultDto } from "./context";

export enum TestActionEnums {
  //create Test
  createTestPending = "CREATE_TEST_PENDING",
  createTestSuccess = "CREATE_TEST_SUCCESS",
  createTestError = "CREATE_TEST_ERROR",

  //get All Tests
  getAllTestsPending = "GET_ALL_TESTS_PENDING",
  getAllTestsSuccess = "GET_ALL_TESTS_SUCCESS",
  getAllTestsError = "GET_ALL_TESTS_ERROR",

  //get Test with Questions
  getTestWithQuestionsPending = "GET_TEST_withQ_PENDING",
  getTestWithQuestionsSuccess = "GET_TEST_withQ_SUCCESS",
  getTestWithQuestionsError = "GET_TEST_withQ_ERROR",

  //update Test
  updateTestPending = "UPDATE_TEST_PENDING",
  updateTestSuccess = "UPDATE_TEST_SUCCESS",
  updateTestError = "UPDATE_TEST_ERROR",

  //delete Test
  deleteTestPending = "DELETE_TEST_PENDING",
  deleteTestSuccess = "DELETE_TEST_SUCCESS",
  deleteTestError = "DELETE_TEST_ERROR",

  //submit Test Answer
  submitTestAnswerPending = "SUBMIT_TEST_PENDING",
  submitTestAnswerSuccess = "SUBMIT_TEST_SUCCESS",
  submitTestAnswerError = "SUBMIT_TEST_ERROR",
}

// Create Test actions
export const createTestPending = () => ({
  type: TestActionEnums.createTestPending,
  payload: { isPending: true, isSuccess: false, isError: false },
});

export const createTestSuccess = (test: TestDto) => ({
  type: TestActionEnums.createTestSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    test,
  },
});

export const createTestError = () => ({
  type: TestActionEnums.createTestError,
  payload: { isPending: false, isSuccess: false, isError: true },
});

// Get All Tests actions
export const getAllTestsPending = () => ({
  type: TestActionEnums.getAllTestsPending,
  payload: { isPending: true, isSuccess: false, isError: false },
});

export const getAllTestsSuccess = (tests: TestDto[]) => ({
  type: TestActionEnums.getAllTestsSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    tests,
  },
});

export const getAllTestsError = () => ({
  type: TestActionEnums.getAllTestsError,
  payload: { isPending: false, isSuccess: false, isError: true },
});

// Get Test with Questions actions
export const getTestWithQuestionsPending = () => ({
  type: TestActionEnums.getTestWithQuestionsPending,
  payload: { isPending: true, isSuccess: false, isError: false },
});

export const getTestWithQuestionsSuccess = (test: TestWithQuestionsDto) => ({
  type: TestActionEnums.getTestWithQuestionsSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    test,
  },
});

export const getTestWithQuestionsError = () => ({
  type: TestActionEnums.getTestWithQuestionsError,
  payload: { isPending: false, isSuccess: false, isError: true },
});

// Update Test actions
export const updateTestPending = () => ({
  type: TestActionEnums.updateTestPending,
  payload: { isPending: true, isSuccess: false, isError: false },
});

export const updateTestSuccess = (test: TestDto) => ({
  type: TestActionEnums.updateTestSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    test,
  },
});

export const updateTestError = () => ({
  type: TestActionEnums.updateTestError,
  payload: { isPending: false, isSuccess: false, isError: true },
});

// Delete Test actions
export const deleteTestPending = () => ({
  type: TestActionEnums.deleteTestPending,
  payload: { isPending: true, isSuccess: false, isError: false },
});

export const deleteTestSuccess = () => ({
  type: TestActionEnums.deleteTestSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
  },
});

export const deleteTestError = () => ({
  type: TestActionEnums.deleteTestError,
  payload: { isPending: false, isSuccess: false, isError: true },
});

// Submit Test Answer actions
export const submitTestAnswerPending = () => ({
  type: TestActionEnums.submitTestAnswerPending,
  payload: { isPending: true, isSuccess: false, isError: false },
});

export const submitTestAnswerSuccess = (
  submissionResult: SubmitTestResultDto
) => ({
  type: TestActionEnums.submitTestAnswerSuccess,
  payload: {
    isPending: false,
    isSuccess: true,
    isError: false,
    submissionResult,
  },
});

export const submitTestAnswerError = () => ({
  type: TestActionEnums.submitTestAnswerError,
  payload: { isPending: false, isSuccess: false, isError: true },
});
