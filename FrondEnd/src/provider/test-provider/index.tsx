"use client";
import { useContext, useReducer } from "react";
import { TestReducer } from "./reducer";
import {
  CreateTestDto,
  UpdateTestDto,
  SubmitTestAnswersDto,
  INITIAL_STATE,
  TestActionContext,
  TestStateContext,
  ITestStateContext,
  ITestActionContext,
  TestWithQuestionsDto,
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

  const createTest = async (test: CreateTestDto) => {
    dispatch(createTestPending());
    try {
      const response = await instance.post("/Test/Create", test);
      dispatch(createTestSuccess(response.data.result));
    } catch (error) {
      console.error("Error creating test:", error);
      dispatch(createTestError());
    }
  };

  const getAllTests = async () => {
    dispatch(getAllTestsPending());
    try {
      const response = await instance.get("/Test/GetAll", {
        params: {
          MaxResultCount: 20,
          SkipCount: 0,
        },
      });

      dispatch(getAllTestsSuccess(response.data.result.items));
    } catch (error) {
      console.error("Error fetching tests:", error);
      dispatch(getAllTestsError());
    }
  };

  const getTestWithQuestions = async (id: string) => {
    dispatch(getTestWithQuestionsPending());
    try {
      // Use axios params object to ensure proper URL encoding
      const response = await instance.get("/Test/GetTestWithQuestions", {
        params: {
          id: id,
        },
      });

      const testWithQuestions: TestWithQuestionsDto = response.data.result;

      dispatch(getTestWithQuestionsSuccess(testWithQuestions));
    } catch (error) {
      console.error("Error fetching test with questions:", error);
      dispatch(getTestWithQuestionsError());
    }
  };
  const updateTest = async (test: UpdateTestDto) => {
    dispatch(updateTestPending());
    try {
      const response = await instance.put("/Test/Update", test);
      dispatch(updateTestSuccess(response.data.result));
    } catch (error) {
      console.error("Error updating test:", error);
      dispatch(updateTestError());
    }
  };

  const deleteTest = async (id: string) => {
    dispatch(deleteTestPending());
    try {
      await instance.delete("/Test/Delete", {
        params: { id },
      });
      dispatch(deleteTestSuccess());
    } catch (error) {
      console.error("Error deleting test:", error);
      dispatch(deleteTestError());
    }
  };

  const submitTestAnswers = async (answers: SubmitTestAnswersDto) => {
    dispatch(submitTestAnswerPending());
    try {
      const response = await instance.post("Test/SubmitTestAnswers", answers);
      dispatch(submitTestAnswerSuccess(response.data.result.items));
    } catch (error) {
      console.error("Error submitting test answers:", error);
      dispatch(submitTestAnswerError());
    }
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

export const useTestState = (): ITestStateContext => {
  const context = useContext(TestStateContext);
  if (!context) {
    throw new Error("useTestState must be used within a TestProvider");
  }
  return context;
};

export const useTestAction = (): ITestActionContext => {
  const context = useContext(TestActionContext);
  if (!context) {
    throw new Error("useTestAction must be used within a TestProvider");
  }
  return context;
};
