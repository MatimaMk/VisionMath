"use client";
import { createAction } from "redux-actions";
import { IAuthStateContext, ICreateEducator, ICreateStudent } from "./context";

export enum AuthActionEnums {
  // define 3 states for each action (pending , success, error)

  signInPending = "SIGN_IN_PENDING",
  signInSuccess = "SIGN_IN_SUCCESS",
  signInError = "SIGN_IN_ERROR",

  signUpPending = "SIGN_UP_PENDING",
  signUpSuccess = "SIGN_UP_SUCCESS",
  signUpError = "SIGN_UP_ERROR",

  signUpEduPending = "SIGN_UPEDU_PENDING",
  signUpEduSuccess = "SIGN_UPEDU_SUCCESS",
  signUpEduError = "SIGN_UPEDU_ERROR",

  signOutPending = "SIGN_OUT_PENDING",
  signOutSuccess = "SIGN_OUT_SUCCESS",
  signOutError = "SIGN_OUT_ERROR",
}
//SIGN UP ACTIONS
export const signUpPending = createAction<IAuthStateContext>(
  AuthActionEnums.signUpPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const signUpSuccess = createAction<IAuthStateContext, ICreateStudent>(
  AuthActionEnums.signUpSuccess,
  (studentData: ICreateStudent) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    studentData: studentData,
  })
);

export const signUpEduError = createAction<IAuthStateContext>(
  AuthActionEnums.signUpError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const signUpEduPending = createAction<IAuthStateContext>(
  AuthActionEnums.signUpEduPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const signUpEduSuccess = createAction<
  IAuthStateContext,
  ICreateEducator
>(AuthActionEnums.signUpEduSuccess, (educatorData: ICreateEducator) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  educatorData: educatorData,
}));

export const signUpError = createAction<IAuthStateContext>(
  AuthActionEnums.signUpEduError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//SIGN IN ACTIONS
export const signInPending = createAction<IAuthStateContext>(
  AuthActionEnums.signInPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const signInSuccess = createAction<IAuthStateContext, string>(
  AuthActionEnums.signInSuccess,
  (token: string) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    token: token,
  })
);
export const signInError = createAction<IAuthStateContext>(
  AuthActionEnums.signInError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
