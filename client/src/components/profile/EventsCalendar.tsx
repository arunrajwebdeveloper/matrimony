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
  let { key, ...rest } = props;
  let classes = rest.className;
  const formattedDate = currentDate.format("DD-MM-YYYY");

  // Check if the date has an  event
  const eventsForDay = events.filter((event) => event.date === formattedDate);
  const eventLength = eventsForDay?.length;
  if (eventLength > 0) {
    classes += " has-event group";

    // Check if the event date is in the past
    if (currentDate.isBefore(moment(), "day")) {
      classes += " past-event";
    } else {
      classes += " upcoming-event";
    }
  }

  return (
    <td key={key} {...rest} className={classes}>
      {currentDate.date()}
      {eventLength !== 0 && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-3
              opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
              bg-slate-700 text-white text-xs rounded py-2 px-4
              transition-all duration-300 ease-in-out whitespace-nowrap z-50 select-none pointer-events-none"
        >
          <span className="relative z-10">{`${eventLength} event${
            eventLength > 1 ? "s" : ""
          }`}</span>
          <div className="absolute w-3 h-3 bg-slate-700 transform rotate-45 rounded-xs -bottom-1 z-0 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </td>
  );
};

// Disable past days
// const isValidDate = (currentDate: moment.Moment) => {
//   return currentDate.isSameOrAfter(moment(), "day");
// };

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
    <div className="py-1">
      <h2 className="font-semibold text-black text-md mb-6">Events Calendar</h2>
      <Datetime
        dateFormat="YYYY-MM-DD"
        timeFormat={false}
        input={false}
        renderDay={renderDay}
        // isValidDate={isValidDate}
        onChange={handleDateChange}
      />
      {/* Legends */}
      <div className="flex items-center gap-4 mt-2 select-none">
        <div className="text-xs text-gray-800 flex items-center gap-2">
          <span className="w-[6px] h-[6px] block bg-gray-900 rounded-full"></span>
          <span>Past</span>
        </div>
        <div className="text-xs text-gray-800 flex items-center gap-2">
          <span className="w-[6px] h-[6px] block bg-rose-600 rounded-full"></span>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}

export default EventsCalendar;
