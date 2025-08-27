/**
 * A robust, internationalized utility function using the native Intl.RelativeTimeFormat API.
 * This is the recommended approach for production applications as it handles multiple languages,
 * pluralization rules, and different formatting styles automatically.
 *
 * @param {Date | string | number} timestamp The timestamp to convert.
 * @param {string} locale The locale to use for formatting (e.g., 'en-US', 'es', 'fr'). Defaults to 'en-US'.
 * @returns {string} A relative time string, e.g., "1 minute ago", "hace 1 minuto".
 */
// export const formatRelativeTime = (
//   timestamp: Date | string | number,
//   locale: string = "en-US"
// ): string => {
//   const date = new Date(timestamp);
//   const now = new Date();
//   const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

//   const rtf = new Intl.RelativeTimeFormat(locale, {
//     numeric: "auto",
//     style: "long",
//   });

//   // Define the time units to check in descending order
//   const units: [Intl.RelativeTimeFormatUnit, number][] = [
//     ["year", 365 * 24 * 60 * 60],
//     ["month", 30 * 24 * 60 * 60],
//     ["day", 24 * 60 * 60],
//     ["hour", 60 * 60],
//     ["minute", 60],
//     ["second", 1],
//   ];

//   for (const [unit, secondsInUnit] of units) {
//     const value = Math.round(diffInSeconds / secondsInUnit);
//     if (Math.abs(value) >= 1 || unit === "second") {
//       return rtf.format(value, unit);
//     }
//   }

//   return "just now"; // Fallback
// };

/**
 * @fileoverview Utility functions for generating customized relative time strings.
 */

/**
 * A robust utility function to generate relative time text based on a specific set of rules.
 * This function uses native JavaScript Date and Intl APIs for reliable formatting.
 *
 * The output format is:
 * - "Just Now" for timestamps less than 60 seconds old.
 * - "X min ago" for timestamps between 1 minute and 59 minutes old.
 * - "X hrs ago" for timestamps between 1 hour and 2 hours old.
 * - "Today, 12:30 PM" for timestamps on the current day that are older than 2 hours.
 * - "Yesterday, 12:30 PM" for timestamps on the previous day.
 * - "June 7, 2024 at 11:55 AM" for older timestamps.
 *
 * @param {Date | string | number} timestamp The timestamp to convert. Can be a Date object, an ISO string, or a number representing milliseconds.
 * @returns {string} A formatted relative time string.
 */
export const formatRelativeTime = (
  timestamp: Date | string | number
): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Helper function to check if two dates are the same day in the LOCAL timezone
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Calculate the difference in milliseconds between the two UTC times.
  // This is the key to getting an accurate relative time.
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  // Formatting options for Intl.DateTimeFormat
  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const fullFormatOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Case 1: Less than 1 minute (based on accurate UTC difference)
  if (diffInSeconds < 60) {
    return "Just Now";
  }

  // Case 2: Between 1 and 59 minutes (based on accurate UTC difference)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  // Case 3: Between 1 and 2 hours (based on accurate UTC difference)
  if (diffInHours < 2) {
    return `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
  }

  // Case 4: Today
  // For "Today" and "Yesterday", we still want to use the local date,
  // since the user's perception of "today" is based on their local timezone.
  if (isSameDay(date, now)) {
    const formattedTime = new Intl.DateTimeFormat(
      "en-US",
      timeFormatOptions
    ).format(date);
    return `Today, ${formattedTime}`;
  }

  // Case 5: Yesterday
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (isSameDay(date, yesterday)) {
    const formattedTime = new Intl.DateTimeFormat(
      "en-US",
      timeFormatOptions
    ).format(date);
    return `Yesterday, ${formattedTime}`;
  }

  // Case 6: All other dates
  const formattedDate = new Intl.DateTimeFormat(
    "en-US",
    fullFormatOptions
  ).format(date);
  return formattedDate.replace(" at", " at ");
};
