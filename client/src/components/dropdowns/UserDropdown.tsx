import { useState, useRef, useEffect, FC, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface MenuType {
  name: string;
  action?: string | (() => void);
}

interface UserDropdownProps {
  avatar?: string;
  menu: MenuType[];
  username: string;
  email: string;
}

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
        className="rounded-[50%] overflow-hidden w-[34px] h-[34px] cursor-pointer"
      >
        <img src={avatar} alt="" className="object-cover w-[34px] h-[34px]" />
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-[280px] rounded-md shadow-lg bg-white z-[220]"
          role="menu"
        >
          <div className="py-1">
            <div className="p-4 flex items-center gap-4">
              <div className="rounded-[50%] overflow-hidden w-[50px] h-[50px] flex-none relative">
                <img
                  src={avatar}
                  alt=""
                  className="object-cover w-[50px] h-[50px]"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm">{username}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
            </div>
            {/* Dropdown menu items */}
            {menu?.map(({ name, action }) => {
              const isString = typeof action === "string";

              const handleAction = (action: any) => {
                action();
                toggleDropdown();
              };

              return isString ? (
                <Link
                  key={name}
                  href={action}
                  onClick={toggleDropdown}
                  className="text-gray-700 block py-3 px-4 cursor-pointer text-sm hover:bg-gray-100 transition-colors"
                >
                  {name}
                </Link>
              ) : (
                <a
                  key={name}
                  onClick={() => handleAction(action)}
                  className="text-gray-700 block py-3 px-4 cursor-pointer text-sm hover:bg-gray-100 transition-colors"
                >
                  {name}
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
