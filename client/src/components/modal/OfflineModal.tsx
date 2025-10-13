"use client";

import React, { useState, useEffect } from "react";
import type { FC } from "react";

const OfflineModal: FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Only run this code on the client-side
    // This is a crucial check for Next.js to avoid errors during server-side rendering (SSR)
    if (typeof window !== "undefined") {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      setIsOnline(navigator.onLine);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Use a separate useEffect to handle the body overflow
  useEffect(() => {
    if (typeof document !== "undefined") {
      // If the user is offline, set overflow to hidden
      if (!isOnline) {
        document.body.style.overflow = "hidden";
      } else {
        // Otherwise, revert it to its default state
        document.body.style.overflow = "unset";
      }
    }

    // This cleanup function runs when the component unmounts or before the effect re-runs
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOnline]); // This effect depends on the 'isOnline' state

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-[99999] select-none">
      <div className="bg-white px-8 py-12 rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="w-[40px] h-[40px] mx-auto mb-4 text-orange-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          You're Offline
        </h2>
        <p className="text-gray-800 text-base m-0 text-center">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
};

export default OfflineModal;
