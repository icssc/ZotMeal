import Image from "next/image";
import Link from "next/link";
import { PanelRight } from "lucide-react";
import { Button } from "./shadcn/button";
import { Sheet, SheetTrigger } from "./shadcn/sheet";
import SidebarContent from "./sidebar/sidebar-content";
import { DatePicker } from "./shadcn/date-picker";
import { useDate } from "@/context/date-context";

export default function Toolbar() {
  const { selectedDate, setSelectedDate } = useDate();

  const handleDateSelect = (newDateFromPicker: Date | undefined) => {
    if (newDateFromPicker) {
      const today = new Date();
      // Compare year, month, and day. newDateFromPicker is likely at 00:00:00.
      if (
        newDateFromPicker.getFullYear() === today.getFullYear() &&
        newDateFromPicker.getMonth() === today.getMonth() &&
        newDateFromPicker.getDate() === today.getDate()
      ) {
        // It's today. Create a new Date object for "now" to get current time.
        setSelectedDate(new Date());
      } else {
        // It's another day. Use the date from picker (which is at 00:00:00).
        setSelectedDate(newDateFromPicker);
      }
    } else {
      // Date was cleared in the picker
      setSelectedDate(undefined);
    }
  };

    return (
      <div 
        className="w-full h-18 absolute flex items-center justify-between px-4 py-2 
          bg-zinc-50 bg-opacity-45 backdrop-blur-md z-10">
        <Link href="/">
          <Image
            className="rounded-full cursor-pointer"
            src="/Zotmeal-Logo.webp" 
            alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
            width={40}
            height={40}
          />
        </Link>
        <Sheet>
          <div className="flex gap-4 items-center">
            <DatePicker
              date={selectedDate}
              onSelect={handleDateSelect}
            />
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelRight />
              </Button>
            </SheetTrigger>
            <SidebarContent />
          </div>
        </Sheet>
      </div>
    )
}
