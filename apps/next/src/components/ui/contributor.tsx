import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./shadcn/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./shadcn/hover-card"


interface ContributorProps {
    name: string;
    username: string;
    profileSrc: string;
    bio: string;
    contributions: number;
}

export default function Contributor({
  name,
  username, 
  profileSrc, 
  bio,
  contributions
} : ContributorProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage
            src={profileSrc}
            className="rounded-full"
          />
          <AvatarFallback>
            {username.slice(0, 2).toWellFormed()}
          </AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent>
        <a href={`https://github.com/${username}`} className="flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            <Avatar className="h-12 w-12 rounded-full">
              <AvatarImage
                src={profileSrc}
                className="rounded-full"
              />
              <AvatarFallback>
                {username.slice(0, 2).toWellFormed()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2">
                <p className="font-bold hover:underline">{name}</p>
                <p className="text-sm text-green-500">+{contributions}</p>
              </div>
              <p className="flex gap-1 text-sm items-center text-zinc-500"><User size={18}/>{username}</p>
            </div>
          </div>
          <p className="text-sm">{bio}</p>
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}