"use client";
import {
  INITIAL_STATE,
  AuthActionContext,
  AuthStateContext,
  ICreateStudent,
  ISignInRequest,
  ISignInResponse,
  ICreateEducator,
} from "./context";
import { AuthReducer } from "./reducer";
import { useContext, useReducer } from "react";
import {
  signInError,
  signInPending,
  signInSuccess,
  signUpEduError,
  signUpEduPending,
  signUpEduSuccess,
  signUpError,
  signUpPending,
  signUpSuccess,
} from "./actions";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const signUp = async (studentData: ICreateStudent): Promise<void> => {
    dispatch(signUpPending());

    try {
      const endpoint = `https://localhost:44311/api/services/app/Student/Create`;
      const response = await axios.post<ICreateStudent>(endpoint, {
        ...studentData,
        role: "STUDENT",
      });
      console.log(response);
      dispatch(signUpSuccess(response.data));
    } catch (error) {
      dispatch(signUpError());
      throw error;
    }
  };

  const signUpEdu = async (payload: ICreateEducator): Promise<void> => {
    dispatch(signUpEduPending());

    try {
      const endpoint = `https://localhost:44311/api/services/app/Educator/Create`;
      const response = await axios.post<ICreateEducator>(endpoint, {
        payload,
        role: "EDUCATOR",
      });
      console.log(response);
      dispatch(signUpEduSuccess(response.data));
      //message.success("Educator registration successful!");
    } catch (error) {
      dispatch(signUpEduError());
      throw error;
    }
  };
  const signIn = async (
    SignInRequest: ISignInRequest
  ): Promise<ISignInResponse> => {
    dispatch(signInPending());
    const endpoint = "https://localhost:44311/api/TokenAuth/Authenticate";

    return axios
      .post(endpoint, SignInRequest)
      .then((response) => {
        const token = response.data.result.accessToken;
        if (token) {
          sessionStorage.setItem("jwt", token);
          dispatch(signInSuccess(token));
          return response.data;
        } else {
          throw new Error("There is no response");
        }
      })
      .catch((error) => {
        console.error(
          "Error during signIn:",
          error.response?.data?.message || error
        );
        dispatch(signInError());
        throw error;
      });
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider value={{ signUp, signIn, signUpEdu }}>
        {children}
      </AuthActionContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionContext);
  if (!context) {
    throw new Error("useAuthActions must be used within a AuthProvider");
  }
  return context;
};
