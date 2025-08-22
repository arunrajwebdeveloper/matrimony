"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/utils/constants";

function GreetingCard({ username }: { username: string }) {
  const [greetingMessage, setGreetingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function getGreeting() {
    setIsLoading(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await api.get(API_ENDPOINTS.GET_TIME, {
        params: { tz: timezone },
      });

      const hour = response?.data?.hour;

      let greeting = "";
      if (hour < 12) greeting = "Good morning 🌞";
      else if (hour < 18) greeting = "Good afternoon 🌤️";
      else greeting = "Good evening 🌙";

      setGreetingMessage(`${greeting}, ${username}!`);
    } catch (error) {
      console.error("Failed to get server time:", error);
      setGreetingMessage(`Hello, ${username}!`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getGreeting();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{greetingMessage || ""}</div>;
}

export default GreetingCard;
