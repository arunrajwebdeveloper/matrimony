import React from "react";
import Link from "next/link";

interface CardProps {
  value: string | number;
  title: string;
  label: string;
  users: string[];
  color?: string;
  href?: string;
}

function StatisticsCard({
  value = 0,
  title,
  label,
  users = [],
  color = "gray",
  href = "",
}: CardProps) {
  const bgColorMap: any = {
    orange: "bg-orange-100",
    blue: "bg-blue-100",
    green: "bg-green-100",
    violet: "bg-violet-100",
    gray: "bg-gray-100",
  };

  const textColorMap: any = {
    orange: "text-orange-600",
    blue: "text-blue-600",
    green: "text-green-600",
    violet: "text-violet-600",
    gray: "text-gray-700",
  };

  return (
    <Link
      href={href}
      className="border hover:bg-slate-50 rounded-md p-6 border-slate-200 hover:shadow-sm transition duration-300"
    >
      <p
        className={`text-6xl mb-3 font-mono font-light ${textColorMap[color]}`}
      >
        {value}
      </p>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <span
        className={`inline-block text-xs py-0.5 px-2 ${bgColorMap[color]} ${textColorMap[color]} rounded-2xl`}
      >
        {label}
      </span>
      {users && users?.length !== 0 && (
        <div className="flex items-center mt-6">
          {users?.slice(0, 5)?.map((photo) => {
            return (
              <img
                key={photo}
                className="w-[30px] h-[30px] object-cover -ms-2 rounded-[50%] border-2 border-white"
                src={photo}
                alt=""
              />
            );
          })}
        </div>
      )}
    </Link>
  );
}

export default StatisticsCard;
