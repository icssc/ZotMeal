import { DialogContent } from "./dialog";
import { EventInfo } from "./event-card";
import { DialogHeader, DialogTitle, DialogDescription } from "./dialog";

export default function EventDialogContent(props: EventInfo) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.name}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    )
}