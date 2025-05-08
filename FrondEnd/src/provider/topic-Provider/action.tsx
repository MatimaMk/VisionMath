"use client";
import { createAction } from "redux-actions";
import { ITopicStateContext } from "./context";
import { ITopic } from "./context";

export enum TopicActionEnums {
  getTopicsPending = "GET_TOPICS_PENDING",
  getTopicsSuccess = "GET_TOPICS_SUCCESS",
  getTopicsError = "GET_TOPICS_ERROR",

  getTopicPending = "GET_TOPIC_PENDING",
  getTopicSuccess = "GET_TOPIC_SUCCESS",
  getTopicError = "GET_TOPIC_ERROR",

  createTopicPending = "CREATE_TOPIC_PENDING",
  createTopicSuccess = "CREATE_TOPIC_SUCCESS",
  createTopicError = "CREATE_TOPIC_ERROR",

  updateTopicPending = "UPDATE_TOPIC_PENDING",
  updateTopicSuccess = "UPDATE_TOPIC_SUCCESS",
  updateTopicError = "UPDATE_TOPIC_ERROR",

  deleteTopicPending = "DELETE_TOPIC_PENDING",
  deleteTopicSuccess = "DELETE_TOPIC_SUCCESS",
  deleteTopicError = "DELETE_TOPIC_ERROR",
}

// Get Topics
export const getTopicsPending = createAction<ITopicStateContext>(
  TopicActionEnums.getTopicsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getTopicsSuccess = createAction<ITopicStateContext, ITopic[]>(
  TopicActionEnums.getTopicsSuccess,
  (topics) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    topics,
  })
);

export const getTopicsError = createAction<ITopicStateContext>(
  TopicActionEnums.getTopicsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get Single Topic

export const getTopicPending = createAction<ITopicStateContext>(
  TopicActionEnums.getTopicPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getTopicSuccess = createAction<ITopicStateContext, ITopic>(
  TopicActionEnums.getTopicSuccess,
  (Topic: ITopic) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    topic: Topic,
  })
);

export const getTopicError = createAction<ITopicStateContext>(
  TopicActionEnums.getTopicError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create Topic
export const createTopicPending = createAction<ITopicStateContext>(
  TopicActionEnums.createTopicPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createTopicSuccess = createAction<ITopicStateContext, ITopic>(
  TopicActionEnums.createTopicSuccess,
  (topic: ITopic) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    topic,
  })
);

export const createTopicError = createAction<ITopicStateContext>(
  TopicActionEnums.createTopicError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update Topic
export const updateTopicPending = createAction<ITopicStateContext>(
  TopicActionEnums.updateTopicPending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  })
);

export const updateTopicSuccess = createAction<ITopicStateContext, ITopic>(
  TopicActionEnums.updateTopicSuccess,
  (topic: ITopic) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    topic,
  })
);

export const updateTopicError = createAction<ITopicStateContext>(
  TopicActionEnums.updateTopicError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Delete Topic
export const deleteTopicPending = createAction<ITopicStateContext>(
  TopicActionEnums.deleteTopicPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteTopicSuccess = createAction<ITopicStateContext, ITopic>(
  TopicActionEnums.deleteTopicSuccess,
  (topic: ITopic) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    topic,
  })
);

export const deleteTopicError = createAction<ITopicStateContext>(
  TopicActionEnums.deleteTopicError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
