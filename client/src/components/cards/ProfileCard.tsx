import { ProfileCardProps } from "@/types";
import Link from "next/link";

function ProfileCard({
  title = null,
  className = "",
  link = null,
  children,
}: ProfileCardProps) {
  return (
    <div className={`py-4 px-6 ${className}`}>
      {(title || link) && (
        <div className="mb-6 flex items-center justify-between">
          {title && (
            <h2 className="font-semibold text-black text-md">{title}</h2>
          )}
          {link && (
            <Link className="font-normal text-blue-500 text-xs" href={link}>
              View all
            </Link>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default ProfileCard;
