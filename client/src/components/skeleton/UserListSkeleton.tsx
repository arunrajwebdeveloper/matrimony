import React from "react";

function UserListSkeleton() {
  return (
    <div className="flex items-center animate-pulse rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
      <div className="w-[130px] h-[130px] flex-none shrink-0 bg-gray-200"></div>
      <div className="py-3 px-5 flex-auto space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded-md"></div>
        <div className="w-full h-4 bg-gray-200 rounded-md"></div>
        <div className="w-full h-4 bg-gray-200 rounded-md"></div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default UserListSkeleton;
