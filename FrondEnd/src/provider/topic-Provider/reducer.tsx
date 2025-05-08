"use Client";
import { handleActions } from "redux-actions";
import { TopicActionEnums } from "./action";
import { INITIAL_STATE, ITopicStateContext } from "./context";

export const TopicReducer = handleActions<
  ITopicStateContext,
  ITopicStateContext
>(
  {
    //get all Topics
    [TopicActionEnums.getTopicsPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TopicActionEnums.getTopicsSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TopicActionEnums.getTopicsError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //get single Topic
    [TopicActionEnums.getTopicPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [TopicActionEnums.getTopicSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TopicActionEnums.getTopicError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //create Topic
    [TopicActionEnums.createTopicPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [TopicActionEnums.createTopicSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [TopicActionEnums.createTopicError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //update Topic
    [TopicActionEnums.updateTopicPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [TopicActionEnums.updateTopicSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [TopicActionEnums.updateTopicError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    //delete Topic
    [TopicActionEnums.deleteTopicPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [TopicActionEnums.deleteTopicSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [TopicActionEnums.deleteTopicError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
