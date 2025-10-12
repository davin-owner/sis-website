"use client";
// CLIENT COMPONENT - Uses FullCalendar library which requires browser APIs and DOM manipulation
// Handles interactive calendar features: date selection, event dragging, clicking, etc.
// Requires client-side state management for calendar interactions

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalEvent = {
  id?: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

interface CalendarClickInfo {
  date: Date;
  dateStr: string;
}

interface EventClickInfo {
  event: {
    id: string;
    title: string;
    start: Date | null;
    end: Date | null;
  };
}

interface EventDropInfo {
  event: {
    id: string;
    title: string;
    start: Date | null;
    end: Date | null;
  };
  delta: {
    days: number;
  };
}

export default function CalendarClient({
  events = [],
  onDateClick,
  onEventClick,
  onEventDrop,
}: {
  events?: CalEvent[];
  onDateClick?: (info: CalendarClickInfo) => void;
  onEventClick?: (info: EventClickInfo) => void;
  onEventDrop?: (info: EventDropInfo) => void;
}) {
  return (
    <div className="surface-elevated p-8 transition-all duration-300 hover:shadow-xl">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        selectable
        editable
        droppable={true}
        height="50vh"
        contentHeight="auto"
        expandRows={true}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        scrollTime="09:00:00"
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
      />
    </div>
  );
}
