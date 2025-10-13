"use client";

import React, {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  useState,
} from "react";
import {
  ChatState,
  ChatContextType,
  ChatAction,
  ChatActionType,
} from "@/types";

// Initial state
const initialState: ChatState = {
  user: null,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case ChatActionType.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ChatActionType.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };

    case ChatActionType.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Chat Provider
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);
  const [state, dispatch] = useReducer(authReducer, initialState);

  const value: ChatContextType = {
    ...state,
    dispatch,
    isOpenChat,
    setIsOpenChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
