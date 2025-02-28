import { EventInfo } from "./event-card";
import { Card, CardContent } from "./card";
import Image from "next/image";
import { Clock, MapPinned } from "lucide-react";

export default function EventCardContent(props: EventInfo) {
    return (
      <Card>
        <CardContent className="flex items-center h-full pt-6 gap-6">
          <Image 
            src={props.imgSrc}
            alt={props.alt}
            width={84}
            height={84}
            className="rounded-sm"
          />
          <div className="flex flex-col gap-1 h-full" id="event-card-content">
          <strong className="text-2xl">{props.name}</strong>
          <div className="text-zinc-400 flex gap-1" id="event-card-subheader">
              <Clock className="stroke-zinc-400"/>
              <p>Mar. 11 11:00am</p>
              <MapPinned/>
              <p>Anteatery</p>
          </div>
          <p className="max-w-xl">
              {props.description}
          </p>
          </div>
        </CardContent>
      </Card>
    )
}