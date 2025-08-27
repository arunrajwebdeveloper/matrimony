import moment from "moment";

/**
 * @description This is the helper function to format a date string using Moment.js.
 * It formats the date to 'DD-Month-YYYY' and calculates the age in years.
 * @param {string | undefined | null} dateString The date string to format (e.g., "1990-10-09T18:30:00.000Z").
 * @returns {string} The formatted date and age (e.g., "09-October-1990 (34 Years)").
 */
export const dateOfBirthFormat = (
  dateString: string | undefined | null,
  format: string = "DD MMMM YYYY"
): string => {
  // Check if the date string is null, undefined, or empty.
  if (!dateString) {
    return "N/A";
  }

  try {
    // Parse the date string using moment.js
    const birthDate = moment(dateString);

    // Check if the date is valid
    if (!birthDate.isValid()) {
      return "N/A";
    }

    // Format the date as 'DD-Month-YYYY'
    const formattedDate = birthDate.format(format);

    // Calculate the age in years from the current date
    const age = moment().diff(birthDate, "years");

    // Return the combined string
    return `${formattedDate} (${age} Years)`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "N/A";
  }
};
