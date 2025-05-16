"use client";
import { createContext } from "react";

export interface ICreateStudent {
  firstName: string;
  surname: string;
  emailAddress: string;
  username: string;
  password: string;
  phoneNumber?: string;
  studentNumber?: string;
  role: string;
  dateOfBirth?: Date;
  educatorId?: string; // Using string to represent Guid
  highestQualification?: string;
  yearsOfMathTeaching?: number;
  biography?: string;
}
export interface ICreateEducator {
  firstName: string;
  surname: string;
  emailAddress: string;
  userName: string;
  password: string;
  phoneNumber: string;
  highestQualification: string;
  yearsOfMathTeaching: number;
  biography: string;
}
export interface ISignInRequest {
  userNameOrEmailAddress: "string";
  password: "string";
  rememberClient: true;
}
export interface ISignInResponse {
  result: {
    accessToken: string;
  };
}

// Context shape interface
export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  studentData?: ICreateStudent;
  studenstData?: ICreateStudent[];
  educatorData?: ICreateEducator;
  educatorsData?: ICreateEducator[]; // Array of Auths
}

// Auth action context interface
export interface IAuthActionContext {
  signIn: (SignInRequest: ISignInRequest) => Promise<ISignInResponse>;
  signUp: (studentData: ICreateStudent) => Promise<void>;
  signUpEdu: (educatorData: ICreateEducator) => Promise<void>;
  logout: () => Promise<void>;
}

// Initial state with default values
export const INITIAL_STATE: IAuthStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  studenstData: [],
};

// Create the state context and the action context
export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext | undefined>(
  undefined
);
