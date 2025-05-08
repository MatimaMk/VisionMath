"use client";
import { handleActions } from "redux-actions";
import { IContentStateContext, INITIAL_STATE } from "./context";
import { ContentActionEnums } from "./action";

export const ConentReducer = handleActions<
  IContentStateContext,
  IContentStateContext
>(
  {
    //Create Content
    [ContentActionEnums.createContentPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.createContentSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.createContentError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Get All Contents
    [ContentActionEnums.getAllContentsPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.getAllContentsSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.getAllContentsError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Update Content
    [ContentActionEnums.updateContentPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.updateContentSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.updateContentError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Delete Content
    [ContentActionEnums.deleteContentPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.deleteContentSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.deleteContentError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Upload Content File
    [ContentActionEnums.uploadContentFilePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.uploadContentFileSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.uploadContentFileError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Get Content File
    [ContentActionEnums.getContentFilePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.getContentFileSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.getContentFileError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //Download Content File
    [ContentActionEnums.downloadContentFilePending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [ContentActionEnums.downloadContentFileSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [ContentActionEnums.downloadContentFileError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
