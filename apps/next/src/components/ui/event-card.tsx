import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog, DialogTrigger } from "./dialog";
import EventCardContent from "./event-card-content";
import EventDialogContent from "./event-dialog-content";

export enum EventLocation {
  BRANDYWINE,
  ANTEATERY
}

export interface EventInfo {
    name: string;
    description: string;
    imgSrc: string;
    alt: string;
    time: Date;
    location: EventLocation; 
}

export default function EventCard(props : EventInfo) {
    return (
      <Dialog>
        <DialogTrigger asChild>
            <EventCardContent {... props}/>
        </DialogTrigger>
        <DialogContent>
          <EventDialogContent {... props}/>
        </DialogContent>
      </Dialog>
    )
}