"use client";

import { useContext, useReducer } from "react";
import { TestReducer } from "./reducer";
import {
  IcreateTest,
  INITIAL_STATE,
  TestActionContext,
  TestStateContext,
} from "./context";
import { getAxiosInstace } from "@/utils/axioaInstance";
import {
  createTestError,
  createTestPending,
  createTestSuccess,
  deleteTestError,
  deleteTestPending,
  deleteTestSuccess,
  getAllTestsError,
  getAllTestsPending,
  getAllTestsSuccess,
  getTestWithQuestionsError,
  getTestWithQuestionsPending,
  getTestWithQuestionsSuccess,
  submitTestAnswerError,
  submitTestAnswerPending,
  submitTestAnswerSuccess,
  updateTestError,
  updateTestPending,
  updateTestSuccess,
} from "./actions";

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(TestReducer, INITIAL_STATE);
  const instance = getAxiosInstace();

  const createTest = async (test: IcreateTest) => {
    dispatch(createTestPending());
    const endpoint = "endpoitn url";
    return instance
      .post(endpoint, test)
      .then((response) => dispatch(createTestSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(createTestError());
      });
  };

  const getAllTests = async () => {
    dispatch(getAllTestsPending());
    const endpoint = "endpoitn url";
    return instance
      .get(endpoint)
      .then((response) => dispatch(getAllTestsSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(getAllTestsError());
      });
  };

  const getTestWithQuestions = async (id: string) => {
    dispatch(getTestWithQuestionsPending());
    const endpoint = `endpoitn url${id}`;
    return instance

      .get(endpoint)
      .then((response) => dispatch(getTestWithQuestionsSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(getTestWithQuestionsError());
      });
  };

  const updateTest = async (content: IcreateTest) => {
    dispatch(updateTestPending());
    const endpoint = "endpoitn url";
    return instance
      .put(endpoint, content)
      .then((response) => dispatch(updateTestSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(updateTestError());
      });
  };

  const deleteTest = async (id: string) => {
    dispatch(deleteTestPending());
    const endpoint = `endpoitn url${id}`;
    return instance

      .delete(endpoint)
      .then((response) => dispatch(deleteTestSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(deleteTestError());
      });
  };

  const submitTestAnswers = async () => {
    dispatch(submitTestAnswerPending());
    const endpoint = "endpoitn url";
    return instance
      .post(endpoint)
      .then((response) => dispatch(submitTestAnswerSuccess(response.data)))
      .catch((error) => {
        console.error("Error creating Content:", error);
        dispatch(submitTestAnswerError());
      });
  };

  return (
    <TestStateContext.Provider value={state}>
      <TestActionContext.Provider
        value={{
          createTest,
          getAllTests,
          getTestWithQuestions,
          updateTest,
          deleteTest,
          submitTestAnswers,
        }}
      >
        {children}
      </TestActionContext.Provider>
    </TestStateContext.Provider>
  );
};

export const useTestState = () => {
  const context = useContext(TestStateContext);
  if (!context) {
    throw new Error("useTestState must be used within a TestProvider");
  }
  return context;
};
export const useTestAction = () => {
  const context = useContext(TestActionContext);
  if (!context) {
    throw new Error("useTestAction must be used within a TestProvider");
  }
  return context;
};
