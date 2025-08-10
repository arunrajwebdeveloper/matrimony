import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

/**
 * It is a functional component that accepts an array of breadcrumb items.
 * @param {BreadcrumbProps} props The component props.
 * @returns {JSX.Element} The rendered breadcrumb component.
 */

function Breadcrumb({
  breadcrumbs,
}: BreadcrumbProps): React.JSX.Element | null {
  if (!breadcrumbs || breadcrumbs?.length === 0) {
    return null;
  }

  return (
    <nav className="flex w-full" aria-label="Breadcrumb">
      <ul className="inline-flex items-center space-x-3">
        {breadcrumbs?.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={breadcrumb.href}
              className="inline-flex items-center select-none"
            >
              {isLast ? (
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
