"use client";

import { createAction } from "redux-actions";
import { IContent, IContentStateContext } from "./context";

export enum ContentActionEnums {
  createContentPending = "CREATE_CONTENT_PENDING",
  createContentSuccess = "CREATE_CONTENT_SUCCESS",
  createContentError = "CREATE_CONTENT_ERROR",

  getAllContentsPending = "GET_ALL_CONTENTS_PENDING",
  getAllContentsSuccess = "GET_ALL_CONTENTS_SUCCESS",
  getAllContentsError = "GET_ALL_CONTENTS_ERROR",

  updateContentPending = "UPDATE_CONTENT_PENDING",
  updateContentSuccess = "UPDATE_CONTENT_SUCCESS",
  updateContentError = "UPDATE_CONTENT_ERROR",

  deleteContentPending = "DELETE_CONTENT_PENDING",
  deleteContentSuccess = "DELETE_CONTENT_SUCCESS",
  deleteContentError = "DELETE_CONTENT_ERROR",

  uploadContentFilePending = "UPLOAD_CONTENT_FILE_PENDING",
  uploadContentFileSuccess = "UPLOAD_CONTENT_FILE_SUCCESS",
  uploadContentFileError = "UPLOAD_CONTENT_FILE_ERROR",

  getContentFilePending = "GET_CONTENT_FILE_PENDING",
  getContentFileSuccess = "GET_CONTENT_FILE_SUCCESS",
  getContentFileError = "GET_CONTENT_FILE_ERROR",

  downloadContentFilePending = "DOWNLOAD_CONTENT_FILE_PENDING",
  downloadContentFileSuccess = "DOWNLOAD_CONTENT_FILE_SUCCESS",
  downloadContentFileError = "DOWNLOAD_CONTENT_FILE_ERROR",
}

//Create Content
export const createContentPending = createAction<IContentStateContext>(
  ContentActionEnums.createContentPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createContentSuccess = createAction<
  IContentStateContext,
  IContent
>(ContentActionEnums.createContentSuccess, (content: IContent) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  content,
}));

export const createContentError = createAction<IContentStateContext>(
  ContentActionEnums.createContentError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Get All Contents
export const getAllContentsPending = createAction<IContentStateContext>(
  ContentActionEnums.getAllContentsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getAllContentsSuccess = createAction<
  IContentStateContext,
  IContent[]
>(ContentActionEnums.getAllContentsSuccess, (contents) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  contents,
}));

export const getAllContentsError = createAction<IContentStateContext>(
  ContentActionEnums.getAllContentsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Update Content

export const updateContentPending = createAction<IContentStateContext>(
  ContentActionEnums.updateContentPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateContentSuccess = createAction<
  IContentStateContext,
  IContent
>(ContentActionEnums.updateContentSuccess, (content: IContent) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  content,
}));

export const updateContentError = createAction<IContentStateContext>(
  ContentActionEnums.updateContentError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Delete Content

export const deleteContentPending = createAction<IContentStateContext>(
  ContentActionEnums.deleteContentPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteContentSuccess = createAction<
  IContentStateContext,
  IContent
>(ContentActionEnums.deleteContentSuccess, (content: IContent) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  content,
}));

export const deleteContentError = createAction<IContentStateContext>(
  ContentActionEnums.deleteContentError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Upload Content File
export const uploadContentFilePending = createAction<IContentStateContext>(
  ContentActionEnums.uploadContentFilePending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const uploadContentFileSuccess = createAction<
  IContentStateContext,
  string
>(ContentActionEnums.uploadContentFileSuccess, (pdfUrl: string) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  pdfUrl,
}));

export const uploadContentFileError = createAction<IContentStateContext>(
  ContentActionEnums.uploadContentFileError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Get Content File
export const getContentFilePending = createAction<IContentStateContext>(
  ContentActionEnums.getContentFilePending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getContentFileSuccess = createAction<IContentStateContext, string>(
  ContentActionEnums.getContentFileSuccess,
  (pdfUrl: string) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    pdfUrl,
  })
);

export const getContentFileError = createAction<IContentStateContext>(
  ContentActionEnums.getContentFileError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

//Download Content File
export const downloadContentFilePending = createAction<IContentStateContext>(
  ContentActionEnums.downloadContentFilePending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const downloadContentFileSuccess = createAction<
  IContentStateContext,
  string
>(ContentActionEnums.downloadContentFileSuccess, (pdfUrl: string) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  pdfUrl,
}));

export const downloadContentFileError = createAction<IContentStateContext>(
  ContentActionEnums.downloadContentFileError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
