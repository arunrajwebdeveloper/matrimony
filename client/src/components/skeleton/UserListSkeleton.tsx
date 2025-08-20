import React from "react";

function UserListSkeleton() {
  return (
    <div className="flex items-center animate-pulse rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
      <div className="w-[100px] h-[100px] flex-none shrink-0 bg-gray-200"></div>
      <div className="py-2 px-4 flex-auto space-y-3">
        <div className="w-full h-4 bg-gray-200 rounded-md "></div>
        <div className="w-full h-4 bg-gray-200 rounded-md "></div>
        <div className="w-full h-4 bg-gray-200 rounded-md "></div>
      </div>
    </div>
  );
}

export default UserListSkeleton;
