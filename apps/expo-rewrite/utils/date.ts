import { isSameDay } from "date-fns";

import { Event } from "./useZotmealStore";

export function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    // weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
}

export function formatEventDateRange(event: Event) {
  if (isSameDay(event.start, event.end)) {
    return `${formatDate(event.start)} ${formatTime(event.start)} - ${formatTime(event.end)}`;
  }
  return `${formatDate(event.start)} ${formatTime(event.start)} – ${formatDate(event.end)} ${formatTime(event.end)}`;
}
