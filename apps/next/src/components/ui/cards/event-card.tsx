"use client";

import React from "react";
import { HallEnum } from "@/utils/types";
import { dateToString, toTitleCase } from "@/utils/funcs";
import { Dialog, DialogTrigger } from "../dialog";
import { Card, CardContent } from "../card"
import Image from "next/image";
import EventDialogContent from "../event-dialog-content";
import OngoingBadge from "../ongoing-badge";
import { Clock, MapPinned } from "lucide-react";

export interface EventInfo {
    name: string;
    shortDesc: string;
    longDesc: string;
    imgSrc: string;
    alt: string;
    startTime: Date;
    endTime: Date;
    location: HallEnum; 
    isOngoing: boolean;
}

interface EventCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  props: EventInfo;
}

// Use forwardRef on a wrapper div that DialogTrigger can interact with reliably.
// Render the original Card structure inside this wrapper.
const EventCardContent = React.forwardRef<
  HTMLDivElement,
  EventCardContentProps
>(({ props, ...divProps}, ref) => {
    return (
      <div ref={ref} {...divProps}>
        <Card className="cursor-pointer hover:shadow-lg transition">
          <CardContent className="flex items-center h-full pt-6 gap-6">
            <Image 
              src={props.imgSrc}
              alt={props.alt}
              width={200}
              height={110}
              className="rounded-sm"
            />
            <div className="flex flex-col gap-1 h-full" id="event-card-content">
            <div className="flex flex-row gap-2">
              <strong className="text-2xl">{props.name}</strong>
              {props.isOngoing && <OngoingBadge/>}
            </div>
            <div className="text-zinc-400 flex gap-1" id="event-card-subheader">
                <Clock className="stroke-zinc-400"/>
                <p>{dateToString(props.startTime, props.endTime)}</p>
                <MapPinned/>
                <p>{toTitleCase(HallEnum[props.location])}</p>
            </div>
            <p className="max-w-xl">{props.shortDesc}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
});

EventCardContent.displayName = "EventCardContent";

export default function EventCard(props : EventInfo) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <EventCardContent props={props}/>
        </DialogTrigger>
        <EventDialogContent {... props}/>
      </Dialog>
    )
}

