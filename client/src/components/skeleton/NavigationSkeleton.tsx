import React from "react";

const widths = ["70%", "65%", "40%", "75%", "50%", "35%", "45%", "60%"];

function NavigationSkeleton({ index }: { index: number }) {
  // const width = `${Math.floor(Math.random() * 50) + 20}%`;
  const width = widths[index % widths.length];

  return (
    <div
      className="animate-pulse overflow-hidden h-4 bg-gray-200 rounded-md"
      style={{ width }}
    ></div>
  );
}

export default NavigationSkeleton;
