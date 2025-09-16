import moment from "moment";
import React from "react";
import Datetime from "react-datetime";

const events = [
  { date: "12-08-2025", title: "Submit Documents for Verification" },
  { date: "16-09-2025", title: "Meeting with Sugunan" },
  { date: "24-09-2025", title: "Renewal of Premium Plan" },
  { date: "24-09-2025", title: "Car Insurance renewal" },
  { date: "14-10-2025", title: "Ramanan's Wedding" },
  { date: "18-10-2025", title: "George's Engagement" },
  { date: "06-11-2025", title: "Scheduled meeting with John" },
  { date: "17-11-2025", title: "Update profile details" },
];

const renderDay = (props: any, currentDate: any) => {
  let classes = props.className;
  const formattedDate = currentDate.format("DD-MM-YYYY");

  // Check if the date has an  event
  const eventsForDay = events.filter((event) => event.date === formattedDate);
  const eventLength = eventsForDay?.length;
  if (eventLength > 0) {
    classes += " has-event";

    // Check if the event date is in the past
    if (currentDate.isBefore(moment(), "day")) {
      classes += " past-event";
    } else {
      classes += " upcoming-event";
    }
  }

  return (
    <td
      {...props}
      className={classes}
      title={
        eventLength > 0
          ? `${eventLength} event${eventLength > 1 ? "s" : ""}`
          : ""
      }
    >
      {currentDate.date()}
      {eventsForDay.length > 0 && (
        <span className="absolute bottom-0 right-0 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          {eventsForDay.length}
        </span>
      )}
    </td>
  );
};

// Disable past days
const isValidDate = (currentDate: moment.Moment) => {
  return currentDate.isSameOrAfter(moment(), "day");
};

// on change date
const handleDateChange = (date: moment.Moment | string) => {
  if (!moment.isMoment(date)) return;

  const formattedDate = moment(date).format("DD-MM-YYYY");
  const eventsForDay = events.filter((e) => e.date === formattedDate);

  if (eventsForDay.length === 0) {
    alert(`No events on ${formattedDate}. Show Add Event.`);
  } else {
    alert(
      `Events on ${formattedDate}:\n${eventsForDay
        .map((e) => `- ${e.title}`)
        .join("\n")}`
    );
  }
};

function EventsCalendar() {
  return (
    <div className="py-4">
      <h2 className="font-semibold text-black text-md mb-6">Events Calendar</h2>
      <Datetime
        dateFormat="YYYY-MM-DD"
        timeFormat={false}
        input={false}
        renderDay={renderDay}
        isValidDate={isValidDate}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default EventsCalendar;
