import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Capitalizes and replaces hyphens with spaces
function formatBreadcrumb(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * It is a functional component that accepts an array of breadcrumb items.
 * @returns {JSX.Element} The rendered breadcrumb component.
 */

function Breadcrumb(): React.JSX.Element | null {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: formatBreadcrumb(segment),
      href,
    };
  });

  if (!breadcrumbs || breadcrumbs?.length === 0) {
    return null;
  }

  return (
    <nav className="flex w-full" aria-label="Breadcrumb">
      <ul className="inline-flex items-center space-x-3">
        {breadcrumbs?.map((breadcrumb, index) => {
          const isLastElement = index === breadcrumbs.length - 1;

          return (
            <li
              key={breadcrumb.href}
              className="inline-flex items-center select-none"
            >
              {isLastElement ? (
                // The last item is not a link and has a different style
                <span className="text-xs font-normal text-gray-400">
                  {breadcrumb.label}
                </span>
              ) : (
                // Regular breadcrumb item with a link
                <div className="flex items-center">
                  <Link
                    href={breadcrumb.href}
                    className="inline-flex items-center text-xs font-normal text-gray-500 hover:text-blue-600"
                  >
                    {breadcrumb.label}
                  </Link>
                  <svg
                    className="w-2 h-2 text-gray-500 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Breadcrumb;
