import React from "react";
import Datetime from "react-datetime";

function EventsCalendar() {
  return (
    <div className="py-4">
      <h2 className="font-semibold text-black text-md mb-6">Events Calendar</h2>
      <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} input={false} />
    </div>
  );
}

export default EventsCalendar;
