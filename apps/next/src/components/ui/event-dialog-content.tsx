import { DialogContent } from "./shadcn/dialog";
import { EventInfo } from "./card/event-card";
import { DialogHeader, DialogTitle, DialogDescription } from "./shadcn/dialog";
import Image from "next/image";
import { CalendarPlus, Clock, MapPinned } from "lucide-react";
import { Button } from "./shadcn/button"
import { HallEnum } from "@/utils/types";
import { toTitleCase, dateToString, generateGCalLink } from "@/utils/funcs";

/**
 * `EventDialogContent` renders the detailed view of an event within a dialog.
 * It displays the event's image, name, date/time, location, a long description,
 * and a button to add the event to Google Calendar.
 *
 * This component is typically used as the content for a `Dialog` triggered by an {@link EventCard}.
 * @param {EventInfo} props - The event data to display. See {@link EventInfo} for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the event dialog.
 */
export default function EventDialogContent(props: EventInfo): JSX.Element {
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
            <p>{dateToString(props.startTime, props.endTime)}</p>
            <MapPinned className="stroke-zinc-400" size={20}/>
            <p>
              {toTitleCase(HallEnum[props.location])}
            </p>
          </div>
          <DialogDescription className="mb-8">{props.longDesc}</DialogDescription>
          <div className="w-full flex items-center justify-center">
            <a href={generateGCalLink(props.name, props.longDesc, props.location, props.startTime)} rel="noreferrer" target="_blank">
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