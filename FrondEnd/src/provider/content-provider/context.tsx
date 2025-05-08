"use client";
import { createContext } from "react";
import { contentTypes } from "@/enums/contentType";

export interface IContent {
  id?: string;
  contentTitle?: string;
  contentDescription?: string;
  contentType?: contentTypes;
  textContent?: string;
  orderNumber?: number;
}

export interface IContentStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  content?: IContent;
  contents?: IContent[];
  pdfUrl?: string;
}

// Initial state with default values
export const INITIAL_STATE: IContentStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  contents: [],
};
export interface IContentActionContext {
  createContent: (content: IContent) => void;
  getAllContents: () => void; // Fetch all contents
  updateContent: (content: IContent) => void;
  deleteContent: (id: string) => void; // Delete a content by ID
  uploadContentFile: (pdfUrl: string) => void; // Upload a file and return the URL
  getcontentFile: (id: string) => void; // Fetch a content file by ID
  downloadContentFile: (pdfUrl: string) => void; // Download a content file by URL
}

export const ContentStateContext =
  createContext<IContentStateContext>(INITIAL_STATE);
export const ContentActionContext = createContext<
  IContentActionContext | undefined
>(undefined);
