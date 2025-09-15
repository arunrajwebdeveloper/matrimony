import { useState, useEffect, ReactNode, MouseEvent } from "react";

// Type definitions
interface ChatModalProps {
  show: boolean;
  onHide: () => void;
  children: ReactNode;
}

interface ChatModalHeaderProps {
  closeButton?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

interface ChatModalTitleProps {
  children: ReactNode;
}

interface ChatModalBodyProps {
  children: ReactNode;
}

interface ChatModalFooterProps {
  children: ReactNode;
}

interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  [key: string]: any; // For additional props
}

const ChatModal = ({ show, onHide, children }: ChatModalProps) => {
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
    if (e.target === e.currentTarget && isVisible) {
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
        className={`bg-white py-4 px-4 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Modal subcomponents with types
ChatModal.Header = ({
  closeButton = false,
  onClose,
  children,
}: ChatModalHeaderProps) => (
  <div className="flex items-center justify-between py-4 px-6 gap-4">
    <div className="flex-1">{children}</div>
    {closeButton && (
      <button
        onClick={onClose}
        className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-150"
        aria-label="Close"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>
);

ChatModal.Title = ({ children }: ChatModalTitleProps) => (
  <h4 className="text-lg font-semibold text-gray-800">{children}</h4>
);

ChatModal.Body = ({ children }: ChatModalBodyProps) => (
  <div className="text-gray-500 text-base py-4 px-6">{children}</div>
);

ChatModal.Footer = ({ children }: ChatModalFooterProps) => (
  <div className="flex gap-4 justify-start py-4 px-6">{children}</div>
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
  ChatModalHeaderProps,
  ChatModalTitleProps,
  ChatModalBodyProps,
  ChatModalFooterProps,
  ButtonProps,
};
