import Image from "next/image";
import { CalendarSearch, Settings2, CalendarFold, LogOut, PanelRight, House, Info, Pin } from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./sheet";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import SheetButton from "./sheet-button";
import SheetDivider from "./sheet-divider";

export default function Toolbar() {
    return (
      <div 
        className="w-full h-18 absolute flex items-center justify-between px-4 py-2 
          bg-zinc-50 bg-opacity-45 backdrop-blur-md z-10">
        <Image
          className="rounded-full"
          src="/Zotmeal-Logo.webp" 
          alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
          width={40}
          height={40}
        />
        <Sheet>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" size="icon"><CalendarSearch/></Button>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><PanelRight/></Button>
            </SheetTrigger>
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
                      ZotMeal
                      <span className="text-sm font-normal"> v0.1 (preview)</span>
                    </SheetTitle>
                  </div>
                  <SheetDivider title="Dining Hall Info"/>
                  <SheetButton Icon={House} title="Home"/>
                  <SheetButton Icon={CalendarFold} title="Events"/>
                  <SheetButton Icon={Pin} title="My Favorites"/>
                  <SheetDivider title="Miscellaneous"/>
                  <SheetButton Icon={Settings2} title="Settings"/>
                  <SheetButton Icon={Info} title="About"/>
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
          </div>
        </Sheet>
      </div>
    )
}