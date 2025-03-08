import { DialogContent } from "./dialog";
import { EventInfo, EventLocation } from "./event-card";
import { DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import Image from "next/image";
import { CalendarPlus, Clock, MapPinned } from "lucide-react";
import { Button } from "./button"

const BWINE_ADDY: string = "557+E+Peltason Dr%2C+Irvine%2C+CA%2C+92617";
const ANTEAT_ADDY: string = "4001+Mesa+Rd%2C+Irvine%2C+CA%2C+92617";

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

function generateGCalLink(title: string, desc: string, location: EventLocation, time: Date): string {
  let date: string = `${time.getFullYear()}${(time.getUTCMonth() + 1).toString().padStart(2, '0')}${time.getUTCDate().toString().padStart(2, '0')}T${time.getUTCHours().toString().padStart(2, '0')}${time.getUTCMinutes().toString().padStart(2, '0')}${time.getUTCSeconds().toString().padStart(2, '0')}Z`;

  
  let link: string = `https://www.google.com/calendar/render?action=TEMPLATE` +
  `&text=${location == EventLocation.ANTEATERY ? "Anteatery" : "Brandywine"}:+${title.replace(/\s+/g, "+")}` +
  `&details=${desc.replace(/\s+/g, "+")}` +
  `&location=${location == EventLocation.ANTEATERY ? ANTEAT_ADDY : BWINE_ADDY}` +
  `&dates=${date}/${date}`;

  return link;
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
          <div className="flex gap-2 text-zinc-400 items-center mb-2" id="event-card-subheader">
            <Clock className="stroke-zinc-400" size={20}/>
            <p>{dateToString(props.time)}</p>
            <MapPinned className="stroke-zinc-400" size={20}/>
            <p>
              {props.location == EventLocation.BRANDYWINE ? "Brandywine" 
              : "Anteatery"}
            </p>
          </div>
          <DialogDescription className="mb-8">{props.longDesc}</DialogDescription>
          <div className="w-full flex items-center justify-center">
            <a href={generateGCalLink(props.name, props.longDesc, props.location, props.time)} rel="noreferrer" target="_blank">
              <Button className="[&_svg]:size-5">
                <CalendarPlus/>
                Add to Google Calendar
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    )
}