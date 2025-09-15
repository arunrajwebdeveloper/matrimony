import { useState, useEffect, ReactNode, MouseEvent } from "react";

// Type definitions
interface ChatModalProps {
  show: boolean;
  onHide?: () => void;
  isBackdropClickClose?: boolean;
  children: ReactNode;
}

interface ChatModalBodyProps {
  children: ReactNode;
}
interface ChatModalSidebarProps {
  children: ReactNode;
}
interface ChatModalChatProps {
  children: ReactNode;
}

interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  [key: string]: any; // For additional props
}

const ChatModal = ({
  show,
  onHide,
  isBackdropClickClose = true,
  children,
}: ChatModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      // Start rendering the modal
      setShouldRender(true);
      document.body.style.overflow = "hidden"; // Trigger animation after a small delay to ensure DOM is ready

      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else if (shouldRender) {
      // Start closing animation only if modal was previously rendered
      handleClose();
    }
  }, [show]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    if (shouldRender) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [shouldRender, isVisible]);

  const handleClose = (): void => {
    if (!isVisible) return; // Prevent multiple calls

    setIsVisible(false); // Wait for animation to complete before unmounting
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "unset";
      if (onHide) onHide();
    }, 300); // Match transition duration
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (isBackdropClickClose && e.target === e.currentTarget && isVisible) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-900/50 flex items-center justify-center z-[99999] transition-opacity duration-500 ease-out ${
        // Changed transition-all to transition-opacity
        isVisible ? "opacity-100" : "opacity-0" // Changed bg-opacity-50 to opacity-100 and bg-opacity-0 to opacity-0
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-[1280px] w-full mx-4 h-[95vh] overflow-hidden transform transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Modal subcomponents with types

ChatModal.Body = ({ children }: ChatModalBodyProps) => (
  <div className="w-full h-full flex justify-between">{children}</div>
);

ChatModal.Sidebar = ({ children }: ChatModalSidebarProps) => (
  <div className="w-[320px]">{children}</div>
);

ChatModal.Chat = ({ children }: ChatModalChatProps) => (
  <div className="w-[calc(100%-640px)]">{children}</div>
);

const Button = ({
  variant = "primary",
  onClick,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "px-6 py-2 cursor-pointer rounded font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-500",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { ChatModal, Button };
export type {
  ChatModalProps,
  ChatModalBodyProps,
  ChatModalSidebarProps,
  ChatModalChatProps,
  ButtonProps,
};
