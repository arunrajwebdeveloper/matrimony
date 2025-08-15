import React from "react";

function OnlineStatusDot({
  isOnline,
  size = "sm",
}: {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dotSize = {
    sm: "w-[10px] h-[10px]",
    md: "w-[12px] h-[12px]",
    lg: "w-[16px] h-[16px]",
  }[size];

  return (
    <div
      className={`${dotSize} rounded-[50%] border-[1px] border-white ${
        isOnline ? "bg-green-500" : "bg-amber-400"
      }`}
    ></div>
  );
}

export default OnlineStatusDot;
