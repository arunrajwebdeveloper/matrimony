"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  toast,
  ToastContainer,
  Bounce,
  type ToastOptions,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastContextType {
  showToast: (content: ReactNode, options?: ToastOptions) => void;
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showCustom: (Component: ReactNode, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (content: ReactNode, options?: ToastOptions) => {
    toast(content, options);
  };

  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  };

  const showCustom = (Component: ReactNode, options?: ToastOptions) => {
    toast(Component, options);
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showCustom }}
    >
      {children}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
