"use client";

import { difficultLevel } from "@/enums/difficultLevel";
import { createContext } from "react";

export interface ITopic {
  id?: string;
  topicTittle?: string;
  description?: string;
  estimatedTime?: Date;
  difficultLevel?: difficultLevel;
}

export interface ITopicStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  topic?: ITopic;
  topics?: ITopic[];
}
// Initial state with default values
export const INITIAL_STATE: ITopicStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};
export interface ITopicActionContext {
  createTopic: (topic: ITopic) => void;
  getAllTopics: () => void; // Fetch all topics
  getTopicById: (id: string) => void; // Fetch a single topic by ID
  updateTopic: (topic: ITopic) => void;
  deleteTopic: (id: string) => void; // Delete a topic by ID
}

export const TopicStateContext =
  createContext<ITopicStateContext>(INITIAL_STATE);
export const TopicActionContext = createContext<
  ITopicActionContext | undefined
>(undefined);
