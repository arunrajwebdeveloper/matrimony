"use client";

import { useContext } from "react";
import { ChatContextType } from "@/types";
import ChatContext from "@/contexts/ChatContext";

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }
  return context;
};
