"use client";
import { useEffect, useState } from "react";
import moment from "moment";

export default function LiveClock() {
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-medium text-base">
      {time.format("dddd, DD MMMM YYYY • hh:mm:ss A")}
    </div>
  );
}
