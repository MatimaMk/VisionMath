"use client";
import { createContext } from "react";

export interface ICreateStudent {
  firstName: string;
  surname: string;
  emailAddress: string;
  username: string;
  password: string;
  phoneNumber?: string;
  studentNumber: string;
  role: string;
  dateOfBirth: Date;
  educatorId: string; // Using string to represent Guid
}
export interface ISignInRequest {
  userNameOrEmailAddress: "string";
  password: "string";
  rememberClient: true;
}
// Context shape interface
export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  Auth?: ICreateStudent;
  Auths?: ICreateStudent[]; // Array of Auths
}

// Auth action context interface
export interface IAuthActionContext {
  //signIn: (SignInRequest: ISignInRequest) => Promise<ISignInResponse>;
  signUp: (Auth: ICreateStudent) => Promise<void>;
}

// Initial state with default values
export const INITIAL_STATE: IAuthStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  Auths: [],
};

// Create the state context and the action context
export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext | undefined>(
  undefined
);
