// export function formatRelativeTime(dateInput: string | Date): string {
//   if (!dateInput) return "";

//   const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
//   const now = new Date();
//   const diffMs = now.getTime() - date.getTime();
//   const diffSec = Math.floor(diffMs / 1000);
//   const diffMin = Math.floor(diffSec / 60);
//   const diffHour = Math.floor(diffMin / 60);
//   const diffDay = Math.floor(diffHour / 24);

//   if (diffSec < 60) return "now";
//   if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
//   if (diffHour < 24) return `${diffHour} hr${diffHour > 1 ? "s" : ""} ago`;
//   if (diffDay === 1)
//     return `yesterday ${date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}`;
//   if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

//   // 👇 From here, show absolute too
//   const abs = date.toLocaleString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   if (diffDay < 30) return `${Math.floor(diffDay / 7)} week ago (${abs})`;
//   if (diffDay < 365) return `${Math.floor(diffDay / 30)} month ago (${abs})`;

//   return `${Math.floor(diffDay / 365)} year ago (${abs})`;
// }

/**
 * A robust, internationalized utility function using the native Intl.RelativeTimeFormat API.
 * This is the recommended approach for production applications as it handles multiple languages,
 * pluralization rules, and different formatting styles automatically.
 *
 * @param {Date | string | number} timestamp The timestamp to convert.
 * @param {string} locale The locale to use for formatting (e.g., 'en-US', 'es', 'fr'). Defaults to 'en-US'.
 * @returns {string} A relative time string, e.g., "1 minute ago", "hace 1 minuto".
 */
export const formatRelativeTime = (
  timestamp: Date | string | number,
  locale: string = "en-US"
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "long",
  });

  // Define the time units to check in descending order
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 24 * 60 * 60],
    ["month", 30 * 24 * 60 * 60],
    ["day", 24 * 60 * 60],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    const value = Math.round(diffInSeconds / secondsInUnit);
    if (Math.abs(value) >= 1 || unit === "second") {
      return rtf.format(value, unit);
    }
  }

  return "just now"; // Fallback
};
