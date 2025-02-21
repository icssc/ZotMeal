import Image from "next/image";
import { CalendarSearch, Cog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"


export default function Toolbar() {
    return (
      <div 
        className="w-full h-18 absolute flex items-center justify-between px-4 py-2 
          bg-slate-50 bg-opacity-45 backdrop-blur-md z-10">
        <Image
          className="rounded-full"
          src="/Zotmeal-Logo.webp" 
          alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
          width={40}
          height={40}
        />
        <div className="flex gap-4 items-center">
          <Cog className="stroke-slate-500 w-8"/>
          <CalendarSearch className="stroke-slate-500 w-8"/>
          <Avatar>
            <AvatarImage src="peter.webp"/>
            <AvatarFallback>PA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    )
}