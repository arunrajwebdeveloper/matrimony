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
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="w-[60px] h-[60px] mx-auto mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60px"
            height="60px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.96973 5.03039L18.9697 20.0304L20.0304 18.9697L5.03039 3.96973L3.96973 5.03039ZM2.92454 9.67478C3.71079 8.88852 4.57369 8.2256 5.48917 7.68602L6.58987 8.78672C5.86769 9.17925 5.17917 9.65606 4.53875 10.2172L11.9999 17.5283L13.6826 15.8795L14.7433 16.9402L11.9999 19.6284L2.38879 10.2105L2.92454 9.67478ZM19.4611 10.2172L15.8255 13.7797L16.8862 14.8404L21.611 10.2105L21.0753 9.67478C17.6588 6.25827 12.7953 5.17059 8.45752 6.41173L9.69662 7.65083C13.0757 6.95288 16.7117 7.80832 19.4611 10.2172Z"
              fill="#080341"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          You're Offline
        </h2>
        <p className="text-gray-600 text-base m-0 text-center">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
};

export default OfflineModal;
