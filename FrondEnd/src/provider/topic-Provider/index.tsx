"use client";

import React, { useContext, useReducer } from "react";
import { TopicReducer } from "./reducer";
import {
  INITIAL_STATE,
  ITopic,
  TopicActionContext,
  TopicStateContext,
} from "./context";
import {
  createTopicError,
  createTopicPending,
  createTopicSuccess,
  getTopicsError,
  getTopicsPending,
  getTopicsSuccess,
} from "./action";
import { getAxiosInstace } from "@/utils/axioaInstance";

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(TopicReducer, INITIAL_STATE);
  const instance = getAxiosInstace();

  // Create Topic
  const createTopic = async (Topic: ITopic) => {
    dispatch(createTopicPending());
    const endpoint = ``;
    await instance
      .post(endpoint, Topic)
      .then((response) => {
        dispatch(createTopicSuccess(response.data));
      })
      .catch((error) => {
        console.error(error);
        dispatch(createTopicError());
      });
  };

  // Get All Patients
  const getAllTopics = async () => {
    dispatch(getTopicsPending());
    const endpoint = `/TopicService/GetAll`;
    await instance
      .get(endpoint)
      .then((response) => {
        dispatch(getTopicsSuccess(response.data));
        return response.data;
      })
      .catch((error) => {
        console.error(error);
        dispatch(getTopicsError());
        return null;
      });
  };

  const getTopicById = async (id: string) => {
    dispatch(getTopicsPending());
    const endpoint = `/TopicService/Get?Id=${id}`;
    await instance
      .get(endpoint)
      .then((response) => {
        dispatch(getTopicsSuccess(response.data));
        return response.data;
      })
      .catch((error) => {
        console.error(error);
        dispatch(getTopicsError());
        return null;
      });
  };

  const updateTopic = async (Topic: ITopic) => {
    dispatch(createTopicPending());
    const endpoint = `/TopicService/Update`;
    await instance
      .put(endpoint, Topic)
      .then((response) => {
        dispatch(createTopicSuccess(response.data));
      })
      .catch((error) => {
        console.error(error);
        dispatch(createTopicError());
      });
  };

  const deleteTopic = async (id: string) => {
    dispatch(createTopicPending());
    const endpoint = `/TopicService/Delete?Id=${id}`;
    await instance
      .delete(endpoint)
      .then((response) => {
        dispatch(createTopicSuccess(response.data));
      })
      .catch((error) => {
        console.error(error);
        dispatch(createTopicError());
      });
  };

  return (
    <TopicStateContext.Provider value={state}>
      <TopicActionContext.Provider
        value={{
          createTopic,
          getAllTopics,
          getTopicById,
          updateTopic,
          deleteTopic,
        }}
      >
        {children}
      </TopicActionContext.Provider>
    </TopicStateContext.Provider>
  );
};

export const useTopicState = () => {
  const context = useContext(TopicStateContext);
  if (!context)
    throw new Error("TopicStateContext must be used within an TopicProvider");
  return context;
};

export const useTopicActions = () => {
  const context = useContext(TopicActionContext);
  if (!context)
    throw new Error("TopicActionContext must be used within an TopicProvider");
  return context;
};
