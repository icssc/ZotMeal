import { HallEnum } from "@/utils/types";
import { Dialog, DialogTrigger } from "./dialog";
import EventCardContent from "./event-card-content";
import EventDialogContent from "./event-dialog-content";

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