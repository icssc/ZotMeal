import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Event } from "@zotmeal/db"

interface EventsContextProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const EventsContext = createContext<EventsContextProps>({events: [], setEvents: () => {}});

export function EventsProvider(props: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {props.children}
    </EventsContext.Provider>
  );
};

export function useEvents() {
    const context = useContext(EventsContext);
    return context;
  };