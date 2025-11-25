"use client";
// CLIENT COMPONENT - Beautiful, theme-matched calendar with enhanced UX
// Optimized for visibility and ease of use across all views
// Translucent worker-colored appointments with consistent styling

import React, { useRef } from "react";
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
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    clientName?: string;
    workerName?: string;
    status?: string;
  };
};

interface CalendarClickInfo {
  date: Date;
  dateStr: string;
  view: {
    type: string;
  };
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
  const calendarRef = useRef<FullCalendar>(null);

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Make dragged event follow cursor smoothly */
        .fc-event-dragging {
          opacity: 0.8 !important;
          cursor: grabbing !important;
          z-index: 9999 !important;
        }

        /* Improve drag visual feedback */
        .fc-event.fc-event-dragging {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3) !important;
          transform: scale(1.05);
          transition: transform 0.1s ease;
        }

        /* Show drop target feedback */
        .fc-highlight {
          background-color: var(--color-accent) !important;
          opacity: 0.15 !important;
        }

        /* Fix overlapping events - make them flexible and side-by-side */
        .fc-timegrid-event-harness {
          min-width: 35px !important;
          max-width: 48% !important;
        }

        .fc-timegrid-event-harness-inset {
          left: 1px !important;
          right: 1px !important;
        }

        .fc-timegrid-event {
          margin-right: 3px !important;
          padding: 2px 4px !important;
        }

        .fc-event-main {
          padding: 2px !important;
        }

        .fc-event-title,
        .fc-event-time {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.75rem !important;
        }
      `}} />
      <div className="surface-elevated p-6 rounded-xl">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next customToday",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        customButtons={{
          customToday: {
            text: "Today",
            click: handleTodayClick,
          },
        }}
        buttonText={{
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        selectable
        editable
        droppable={true}
        eventStartEditable={true}
        eventDurationEditable={true}
        eventDragMinDistance={5}
        slotEventOverlap={true}
        eventOverlap={true}
        nowIndicator={true}
        height="auto"
        contentHeight="600px"
        expandRows={true}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        scrollTime="09:00:00"
        allDaySlot={false}
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
        eventDidMount={(info) => {
          // Apply worker color as CSS variable for the color circle
          const workerColor = info.event.extendedProps?.workerColor || info.event.backgroundColor;
          if (workerColor && info.el) {
            info.el.style.setProperty('--event-color', workerColor);
          }
        }}
        eventContent={(arg) => {
          const { event, view } = arg;
          const isMonthView = view.type === "dayGridMonth";
          const isWeekView = view.type === "timeGridWeek";
          const clientName = event.title;
          const workerName = event.extendedProps?.workerName;

          return (
            <div className="h-full w-full flex items-center justify-center text-center px-1">
              <div className="flex-1 min-w-0">
                {/* Client name - always show */}
                <div
                  className="font-semibold leading-tight truncate"
                  style={{
                    fontSize: isMonthView ? '0.7rem' : (isWeekView ? '0.8rem' : '0.9rem')
                  }}
                >
                  {clientName}
                </div>

                {/* Worker name - show in all views */}
                {workerName && (
                  <div
                    className="opacity-80 leading-tight truncate"
                    style={{
                      fontSize: isMonthView ? '0.6rem' : (isWeekView ? '0.7rem' : '0.75rem'),
                      marginTop: isWeekView ? '0.15rem' : '0.125rem'
                    }}
                  >
                    {workerName}
                  </div>
                )}

                {/* Time - show in month view only */}
                {isMonthView && event.start && (
                  <div className="text-[0.55rem] opacity-70 leading-tight mt-0.5">
                    {new Date(event.start).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </div>
    </>
  );
}
