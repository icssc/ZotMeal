import { DialogContent } from "./dialog";
import { EventInfo, EventLocation } from "./event-card";
import { DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import Image from "next/image";
import { Clock, MapPinned } from "lucide-react";

const numToMonth : {[num: number]: string} = {
  0:  "Jan.",
  1:  "Feb.",
  2:  "Mar.",
  3:  "Apr.",
  4:  "May",
  5:  "Jun.",
  6:  "Jul.",
  7:  "Aug.",
  8:  "Sep.",
  9:  "Oct.",
  10: "Nov.",
  11: "Dec."
};

function dateToString(date: Date): string {
  return `${numToMonth[date.getMonth()]} ${date.getDate()} ${timeToString(date)}`;
}

function padMinutes(minutes: number): string {
  let str: string = minutes+"";
  while (str.length < 2)
    str = "0" + str
  return str;
}

function timeToString(date: Date): string {
  let hours: number = date.getHours();
  let isAfterNoon: boolean = hours > 12;

  return `${isAfterNoon ? hours - 12 : hours}:${padMinutes(date.getMinutes())}${isAfterNoon ? "pm" : "am"}`
}

export default function EventDialogContent(props: EventInfo) {
    return (
      <DialogContent>
        <DialogHeader>
          <Image 
            src={props.imgSrc}
            alt={props.alt}
            width={600}
            height={600}
            className="w-full h-48 object-cover"
          />
        </DialogHeader>
        <div className="px-6">
          <DialogTitle className="mb-1">{props.name}</DialogTitle>
          <div className="flex gap-2 text-zinc-400 items-center" id="event-card-subheader">
            <Clock className="stroke-zinc-400" size={20}/>
            <p>{dateToString(props.time)}</p>
            <MapPinned className="stroke-zinc-400" size={20}/>
            <p>
              {props.location == EventLocation.BRANDYWINE ? "Brandywine" 
              : "Anteatery"}
            </p>
          </div>
          <DialogDescription>{props.description}</DialogDescription>
        </div>
      </DialogContent>
    )
}