import React, { useState, useRef, useLayoutEffect } from "react";
import { Ellipsis, LucideIcon } from "lucide-react";

interface Options {
  label: string;
  icon: LucideIcon;
  action: () => void;
  isShow: boolean;
  className?: string;
}

const MoreDropdown = ({ options }: { options: Options[] }) => {
  // State to track if the menu is open or closed, explicitly typed as boolean
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // State to determine if the menu should be positioned to open upwards, explicitly typed as boolean
  const [isTopPosition, setIsTopPosition] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Function to toggle the menu's open state
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // useLayoutEffect hook to handle side effects like positioning and closing on outside clicks
  useLayoutEffect(() => {
    // Function to calculate and set the menu's position
    const calculatePosition = () => {
      // Use optional chaining (?) to safely access current properties
      if (buttonRef.current && menuRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const availableSpace = window.innerHeight - buttonRect.bottom;

        // Check if there is enough space below the button to open the menu
        // If not, set the position to open upwards
        if (availableSpace < menuHeight + 20) {
          // Add some padding
          setIsTopPosition(true);
        } else {
          setIsTopPosition(false);
        }
      }
    };

    // Function to handle clicks outside the menu to close it,
    // explicitly typing the event as MouseEvent
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is not on the menu or the button, close the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) && // Use `as Node` to satisfy type check
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listeners when the menu is open
    if (isOpen) {
      calculatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      // Recalculate position on window resize
      window.addEventListener("resize", calculatePosition);
    }

    // Clean up event listeners when the component unmounts or the menu closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen]); // The effect runs whenever the isOpen state changes

  return (
    <div className="relative inline-block text-left">
      {/* The button that toggles the menu */}
      <button
        ref={buttonRef}
        type="button"
        className={`${
          isOpen ? "!bg-gray-50" : ""
        } inline-flex cursor-pointer justify-center items-center gap-2 w-9 h-9 rounded-full border border-slate-200 shadow-sm  bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none`}
        onClick={toggleMenu}
      >
        <Ellipsis size={18} color="gray" />
      </button>

      {/* The menu dropdown */}
      {isOpen && options?.length !== 0 && (
        <div
          ref={menuRef}
          className={`
              absolute z-30 w-auto right-0 bg-white border border-slate-100 rounded-md overflow-hidden shadow-lg focus:outline-none
              ${isTopPosition ? "bottom-full mb-2" : "mt-2 top-full"}
            `}
        >
          <div className="py-2 space-y-1" role="none">
            {options?.map(
              ({ label, action, isShow, className, icon: Icon }) => {
                if (!isShow) return null;

                return (
                  <a
                    key={`menu-option-${label}`}
                    className={`flex whitespace-nowrap cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ${
                      className
                        ? className
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      action();
                      toggleMenu();
                    }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </a>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
