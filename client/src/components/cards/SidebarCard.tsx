import { SidebarCardProps } from "@/types";
import Link from "next/link";

function SidebarCard({
  title = null,
  className = "",
  link = null,
  children,
}: SidebarCardProps) {
  return (
    <div className={`py-4 ${className}`}>
      {(title || link) && (
        <div className="mb-6 flex items-center justify-between">
          {title && (
            <h2 className="font-semibold text-black text-md">{title}</h2>
          )}
        </div>
      )}
      <div>{children}</div>
      {link && (
        <div className="mt-3">
          <Link className="font-normal text-blue-500 text-xs" href={link}>
            View all
          </Link>
        </div>
      )}
    </div>
  );
}

export default SidebarCard;
