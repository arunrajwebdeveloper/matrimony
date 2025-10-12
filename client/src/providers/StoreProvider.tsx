"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { initializeAuthThunk } from "@/features/auth/authThunks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Restore user session on mount
    store.dispatch(initializeAuthThunk());
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
