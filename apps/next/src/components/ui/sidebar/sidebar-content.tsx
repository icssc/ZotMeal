import Image from "next/image";
import { SheetContent, SheetTitle } from "../shadcn/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import SidebarButton from "./sidebar-button";
import SidebarDivider from "./sidebar-divider";
import { Settings2, CalendarFold, LogOut, House, Info, Pin, Trophy } from "lucide-react";

/**
 * `SidebarContent` is a presentational component that renders the main content
 * displayed within the application's sidebar.
 *
 * It includes:
 * - A header section with the application logo and title.
 * - Navigation links using {@link SidebarButton} and section separators using {@link SidebarDivider}.
 * - A user profile section at the bottom with an avatar, user details, and a logout button.
 * @returns {JSX.Element} The rendered content for the sidebar.
 */
export default function SidebarContent(): JSX.Element {
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
            <SidebarDivider title="Dining Hall Info"/>
            <SidebarButton Icon={House} title="Home" href="/"/>
            <SidebarButton Icon={CalendarFold} title="Events" href="/events"/>
            <SidebarButton Icon={Pin} title="My Favorites" href="/my-favs" deactivated/>
            <SidebarButton Icon={Trophy} title="Most Liked" href="/leaderboard" deactivated/>
            <SidebarDivider title="Miscellaneous"/>
            <SidebarButton Icon={Settings2} title="Settings" href="/settings" deactivated/>
            <SidebarButton Icon={Info} title="About" href="/about"/>
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