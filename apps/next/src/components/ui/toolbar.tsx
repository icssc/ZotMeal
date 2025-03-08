import Image from "next/image";
import Link from "next/link";
import { CalendarSearch, PanelRight } from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetTrigger } from "./sheet";
import SidebarContent from "./sidebar-content";

export default function Toolbar() {
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
            <Button variant="ghost" size="icon">
              <CalendarSearch />
            </Button>
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
