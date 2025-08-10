import React from "react";

function OnlineStatusDot({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      className={`w-[10px] h-[10px] rounded-[50%] border-[1px] border-white ${
        isOnline ? "bg-green-500" : "bg-amber-400"
      }`}
    ></div>
  );
}

export default OnlineStatusDot;
