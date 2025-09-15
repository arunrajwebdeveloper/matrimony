"use client";

import React from "react";
import { ChatProvider } from "@/contexts/ChatContext";

export interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProviderWrapper: React.FC<ChatProviderProps> = ({ children }) => {
  return <ChatProvider>{children}</ChatProvider>;
};

export default ChatProviderWrapper;
