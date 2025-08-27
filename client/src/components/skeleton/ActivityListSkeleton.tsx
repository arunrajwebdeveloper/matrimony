import React from "react";

function ActivityListSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="w-[26px] h-[26px] flex-none shrink-0 bg-gray-200 rounded-full"></div>
        <div className="w-52 h-4 bg-gray-200 rounded-md"></div>
      </div>
      <div className="w-14 h-4 bg-gray-200 rounded-md"></div>
    </div>
  );
}

export default ActivityListSkeleton;
