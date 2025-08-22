"use client";

import React, { useEffect, useState } from "react";

function GreetingCard({ username }: { username: string }) {
  const [greetingMessage, setGreetingMessage] = useState("");

  useEffect(() => {
    const date = new Date();
    const localHour = date.getHours(); // This gets the hour in the user's local timezone.

    let greeting = "";
    if (localHour >= 5 && localHour < 12) {
      greeting = "Good morning";
    } else if (localHour >= 12 && localHour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    setGreetingMessage(`${greeting}, ${username}!`);
  }, []);

  return (
    <p className="font-medium text-2xl text-gray-900">
      {greetingMessage || `Hello, ${username}`}
    </p>
  );
}

export default GreetingCard;
