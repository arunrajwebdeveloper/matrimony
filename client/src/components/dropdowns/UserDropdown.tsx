import { useState, useRef, useEffect, FC, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserSummaryDisplay from "../profile/UserSummaryDisplay";
import { UserDropdownProps } from "@/types/menu";
import OnlineStatusDot from "../profile/OnlineStatusDot";

const UserDropdown: FC<UserDropdownProps> = ({
  avatar,
  menu,
  username,
  email,
}) => {
  const router = useRouter();

  // State to manage the visibility of the dropdown menu.
  // We explicitly type 'isOpen' as a boolean.
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // A ref to reference the dropdown container.
  // We type the ref to hold an HTMLDivElement or null.
  const dropdownRef = useRef<HTMLDivElement>(null);

  // This useEffect hook handles closing the dropdown when a user clicks outside.
  useEffect(() => {
    // The event handler is typed as a MouseEvent.
    function handleClickOutside(event: MouseEvent): void {
      // Check if the click occurred outside of the dropdown component.
      // The 'contains' method works on HTMLElement types.
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Add the event listener to the document.
    // We cast the function to EventListener to satisfy the type requirement.
    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );

    // Clean up the event listener when the component unmounts.
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, [dropdownRef]);

  // A simple function to toggle the dropdown's visibility.
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    // The main container for the dropdown. 'relative' is crucial for positioning the menu.
    // The ref is attached here.
    <div className="relative" ref={dropdownRef}>
      <div
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className="rounded-[50%] w-[34px] h-[34px] cursor-pointer relative"
      >
        <img
          src={avatar}
          alt=""
          className="object-cover w-[34px] h-[34px] overflow-hidden rounded-[50%]"
        />
        <div className="absolute bottom-0 right-0 z-10 w-[10px] h-[10px]">
          <OnlineStatusDot isOnline={true} />
        </div>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-[280px] rounded-md shadow-lg bg-white z-[220]"
          role="menu"
        >
          <div className="py-1">
            <div className="p-4">
              <UserSummaryDisplay
                avatar={avatar}
                username={username}
                email={email}
                callback={toggleDropdown}
              />
            </div>
            {/* Dropdown menu items */}
            {menu?.map(({ label, icon: Icon, action }) => {
              const isString = typeof action === "string";

              const handleAction = (action: any) => {
                action();
                toggleDropdown();
              };

              return isString ? (
                <Link
                  key={label}
                  href={action}
                  onClick={toggleDropdown}
                  className="text-slate-600 bg-white block py-3 px-4 cursor-pointer text-sm hover:bg-slate-50 transition-colors font-medium"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{label}</span>
                  </div>
                </Link>
              ) : (
                <a
                  key={label}
                  onClick={() => handleAction(action)}
                  className="text-gray-700 block py-3 px-4 cursor-pointer text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{label}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
