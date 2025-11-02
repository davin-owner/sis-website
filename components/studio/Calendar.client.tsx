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
    <div className="surface-elevated p-6 rounded-xl">
      <style jsx global>{`
        /* ===== CALENDAR CONTAINER STYLING ===== */
        .fc {
          font-family: var(--font-sans);
        }

        /* Header styling - match site theme */
        .fc .fc-toolbar {
          padding: 1rem 0;
          margin-bottom: 1.5rem;
        }

        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0de8cd 0%, #0891b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Button styling - match site theme */
        .fc .fc-button {
          background: transparent !important;
          border: 1px solid var(--color-border) !important;
          color: var(--color-foreground) !important;
          text-transform: capitalize !important;
          padding: 0.5rem 1rem !important;
          border-radius: var(--radius-md) !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }

        .fc .fc-button:hover:not(:disabled) {
          background: var(--color-primary) !important;
          color: white !important;
          border-color: var(--color-primary) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 232, 205, 0.3) !important;
        }

        .fc .fc-button-active {
          background: var(--color-primary) !important;
          color: white !important;
          border-color: var(--color-primary) !important;
        }

        .fc .fc-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Calendar grid styling */
        .fc .fc-scrollgrid {
          border-color: var(--color-border) !important;
        }

        .fc th {
          border-color: var(--color-border) !important;
          background: var(--color-muted) !important;
          padding: 0.75rem !important;
          font-weight: 600 !important;
          font-size: 0.875rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: var(--color-text-muted) !important;
        }

        .fc td {
          border-color: var(--color-border) !important;
        }

        /* Day cells - hover effect for clicking */
        .fc .fc-daygrid-day:hover,
        .fc .fc-timegrid-slot:hover {
          background: var(--color-accent) !important;
          cursor: pointer;
        }

        /* Today highlighting */
        .fc .fc-day-today {
          background: rgba(13, 232, 205, 0.15) !important;
        }

        .fc .fc-day-today .fc-daygrid-day-number {
          background: var(--color-primary);
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        /* ===== APPOINTMENT EVENT STYLING ===== */
        .fc-event {
          cursor: pointer !important;
          border: 2px solid !important;
          border-radius: var(--radius-md) !important;
          padding: 0.5rem !important;
          margin: 2px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
          overflow: hidden !important;
          font-weight: 500 !important;
        }

        /* Hover effect - lift and glow */
        .fc-event:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15) !important;
          z-index: 999 !important;
          filter: brightness(1.1) !important;
        }

        /* Active state */
        .fc-event:active {
          transform: translateY(-1px) scale(1.01) !important;
        }

        /* Event text styling */
        .fc-event-time,
        .fc-event-title {
          color: inherit !important;
          font-weight: 500 !important;
        }

        /* Month view - compact but readable */
        .fc-dayGridMonth-view .fc-event {
          font-size: 0.75rem !important;
          padding: 0.25rem 0.5rem !important;
          margin: 1px 2px !important;
        }

        /* Week/Day view - more spacious */
        .fc-timeGridWeek-view .fc-event,
        .fc-timeGridDay-view .fc-event {
          font-size: 0.875rem !important;
          padding: 0.5rem !important;
          min-height: 2rem !important;
        }

        /* Time labels */
        .fc-timegrid-slot-label {
          color: var(--color-text-muted) !important;
          font-size: 0.75rem !important;
          font-weight: 500 !important;
        }

        /* Current time indicator */
        .fc .fc-timegrid-now-indicator-line {
          border-color: var(--color-primary) !important;
          border-width: 2px !important;
        }

        .fc .fc-timegrid-now-indicator-arrow {
          border-color: var(--color-primary) !important;
        }

        /* Day numbers in month view */
        .fc-daygrid-day-number {
          color: var(--color-foreground) !important;
          padding: 0.5rem !important;
          font-weight: 500 !important;
        }

        /* More link ("+X more") */
        .fc .fc-daygrid-more-link {
          color: var(--color-primary) !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
        }

        .fc .fc-daygrid-more-link:hover {
          background: var(--color-accent) !important;
          border-radius: var(--radius-sm);
        }

        /* Scrollbar styling */
        .fc-scroller::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .fc-scroller::-webkit-scrollbar-track {
          background: var(--color-muted);
          border-radius: var(--radius-sm);
        }

        .fc-scroller::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: var(--radius-sm);
        }

        .fc-scroller::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary);
        }

        /* Dark mode adjustments */
        .dark .fc-event {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3) !important;
        }

        .dark .fc-event:hover {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5), 0 6px 12px rgba(0, 0, 0, 0.4) !important;
          filter: brightness(1.15) !important;
        }

        /* Loading state */
        .fc-loading {
          opacity: 0.5;
        }
      `}</style>
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
        eventContent={(arg) => {
          const { event, view } = arg;
          const isMonthView = view.type === "dayGridMonth";
          const isDayView = view.type === "timeGridDay";
          const clientName = event.title;
          const workerName = event.extendedProps?.workerName;
          const status = event.extendedProps?.status;

          // Get status indicator emoji
          const statusIcons: Record<string, string> = {
            scheduled: "🔵",
            completed: "✅",
            cancelled: "❌",
            "no-show": "⚫",
          };
          const statusIcon = statusIcons[status as string] || "🔵";

          return (
            <div className="h-full w-full px-1 py-0.5 overflow-hidden">
              <div className="flex items-start gap-1">
                {/* Status indicator */}
                {!isMonthView && (
                  <span className="text-[10px] leading-none mt-0.5 flex-shrink-0">
                    {statusIcon}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  {/* Client name - always show */}
                  <div
                    className="font-semibold leading-tight truncate"
                    style={{
                      fontSize: isMonthView ? '0.7rem' : '0.875rem',
                      color: 'inherit'
                    }}
                  >
                    {clientName}
                  </div>

                  {/* Worker name - show in week/day views */}
                  {!isMonthView && workerName && (
                    <div
                      className="opacity-90 leading-tight truncate mt-0.5"
                      style={{
                        fontSize: isDayView ? '0.75rem' : '0.7rem',
                        color: 'inherit'
                      }}
                    >
                      {workerName}
                    </div>
                  )}

                  {/* Time - show in month view */}
                  {isMonthView && event.start && (
                    <div className="text-[0.65rem] opacity-80 leading-tight">
                      {new Date(event.start).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
