import Image from "next/image";
import { SheetContent, SheetTitle } from "./sheet";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button } from "./button";
import SheetButton from "./sheet-button";
import SheetDivider from "./sheet-divider";
import { Settings2, CalendarFold, LogOut, House, Info, Pin } from "lucide-react";

export default function SidebarContent() {
    return (
      <SheetContent>
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-1" id="sheet-top">
            <div className="flex gap-2 items-center" id="zotmeal-sheet-header">
              <Image
                src="/ZotMeal-Logo.webp"
                width={32}
                height={32}
                alt="ZotMeal Logo"
                className="rounded-sm"
              />
              <SheetTitle>
                <span>ZotMeal </span>
                <span className="text-sm font-normal">v0.1 (preview)</span>
              </SheetTitle>
            </div>
            <SheetDivider title="Dining Hall Info"/>
            <SheetButton Icon={House} title="Home" href="/"/>
            <SheetButton Icon={CalendarFold} title="Events" href="/events"/>
            <SheetButton Icon={Pin} title="My Favorites" href="/my-favs"/>
            <SheetDivider title="Miscellaneous"/>
            <SheetButton Icon={Settings2} title="Settings" href="/settings"/>
            <SheetButton Icon={Info} title="About" href="/about"/>
          </div>
          <div className="flex p-2 items-center justify-between rounded-md hover:bg-zinc-100 transition-colors" id="sheet-bottom">
            <div className="flex gap-3 items-center">
              <Avatar className="rounded-md">
                <AvatarImage src="/peter.webp" alt="@peter_anteater"/>
                <AvatarFallback>PA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col" id="user-info">
                <strong id="user-name">peter_anteater</strong>
                <span className="text-sm" id="user-email">
                  panteater@uci.edu
                </span>
              </div>
            </div> 
            <Button variant="ghost" size="icon">
              <LogOut/>
            </Button>
          </div>
        </div>
      </SheetContent>
    )
}