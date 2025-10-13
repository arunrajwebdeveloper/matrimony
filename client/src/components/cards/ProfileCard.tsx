import { ProfileCardProps } from "@/types";

function ProfileCard({
  title = null,
  className = "",
  children,
}: ProfileCardProps) {
  return (
    <div className={`py-4 px-6 ${className}`}>
      {title && (
        <div className="mb-6 flex items-center">
          {title && (
            <h2 className="font-semibold text-black text-md">{title}</h2>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default ProfileCard;
