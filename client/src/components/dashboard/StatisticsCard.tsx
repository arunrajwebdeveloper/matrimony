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
  return (
    <Link
      href={href}
      className="border rounded-md p-6 border-slate-200 text-center hover:shadow-sm transition-shadow"
    >
      <h3 className={`text-8xl font-mono font-normal text-${color}-500`}>
        {value}
      </h3>
      <p className="mt-3 text-md font-medium text-slate-600">{title}</p>
      <span
        className={`mt-1 inline-block text-xs py-1 px-2 bg-${color}-100 text-${color}-600 rounded-2xl`}
      >
        {label}
      </span>

      {users && users?.length !== 0 && (
        <div className="flex items-center justify-center mt-6">
          {users?.slice(0, 5)?.map((photo) => {
            return (
              <img
                className="w-[34px] h-[34px] object-cover -ms-2 rounded-[50%] border-2 border-white"
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
