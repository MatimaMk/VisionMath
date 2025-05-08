"use client";

import { createAction } from "redux-actions";
import { IcreateTest, ITestStateContext } from "./context";

export enum TestActionEnums {
  //create Test
  createTestPending = "CREATE_TEST_PENDING",
  createTestSuccess = "CREATE_TEST_SUCCESS",
  createTestError = "CREATE_TEST_ERROR",

  //get All Tests
  getAllTestsPending = "GET_ALL_TESTS_PENDING",
  getAllTestsSuccess = "GET_ALL_TESTS_SUCCESS",
  getAllTestsError = "GET_ALL_TESTS_ERROR",

  //get All Tests
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

  //delete Test
  submitTestAnswerPending = "SUBMIT_TEST_PENDING",
  submitTestAnswerSuccess = "SUBMIT_TEST_SUCCESS",
  submitTestAnswerError = "SUBMIT_TEST_ERROR",
}

//Create Test

export const createTestPending = createAction<ITestStateContext>(
  TestActionEnums.createTestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createTestSuccess = createAction<ITestStateContext, IcreateTest>(
  TestActionEnums.createTestSuccess,
  (test: IcreateTest) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    test,
  })
);

export const createTestError = createAction<ITestStateContext>(
  TestActionEnums.createTestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Get All Tests
export const getAllTestsPending = createAction<ITestStateContext>(
  TestActionEnums.getAllTestsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getAllTestsSuccess = createAction<
  ITestStateContext,
  IcreateTest[]
>(TestActionEnums.getAllTestsSuccess, (tests: IcreateTest[]) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  tests,
}));

export const getAllTestsError = createAction<ITestStateContext>(
  TestActionEnums.getAllTestsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Get Test with Questions
export const getTestWithQuestionsPending = createAction<ITestStateContext>(
  TestActionEnums.getTestWithQuestionsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getTestWithQuestionsSuccess = createAction<
  ITestStateContext,
  IcreateTest
>(TestActionEnums.getTestWithQuestionsSuccess, (test: IcreateTest) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  test,
}));

export const getTestWithQuestionsError = createAction<ITestStateContext>(
  TestActionEnums.getTestWithQuestionsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Update Test

export const updateTestPending = createAction<ITestStateContext>(
  TestActionEnums.updateTestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateTestSuccess = createAction<ITestStateContext, IcreateTest>(
  TestActionEnums.updateTestSuccess,
  (test: IcreateTest) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    test,
  })
);

export const updateTestError = createAction<ITestStateContext>(
  TestActionEnums.updateTestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Delete Test

export const deleteTestPending = createAction<ITestStateContext>(
  TestActionEnums.deleteTestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteTestSuccess = createAction<ITestStateContext, IcreateTest>(
  TestActionEnums.deleteTestSuccess,
  (test: IcreateTest) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    test,
  })
);

export const deleteTestError = createAction<ITestStateContext>(
  TestActionEnums.deleteTestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Submit Test Answer

export const submitTestAnswerPending = createAction<ITestStateContext>(
  TestActionEnums.submitTestAnswerPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const submitTestAnswerSuccess = createAction<
  ITestStateContext,
  IcreateTest
>(TestActionEnums.submitTestAnswerSuccess, (test: IcreateTest) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  test,
}));

export const submitTestAnswerError = createAction<ITestStateContext>(
  TestActionEnums.submitTestAnswerError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
