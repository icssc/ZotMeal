import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"


interface ContributorProps {
    name: string;
    username: string;
    profileSrc: string;
    bio: string;
}

export default function Contributor({
  name,
  username, 
  profileSrc, 
  bio
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
              <p className="font-bold hover:underline">{name}</p>
              <p className="flex gap-1 text-sm items-center text-zinc-500"><User size={18}/>{username}</p>
            </div>
          </div>
          <p className="text-sm">{bio}</p>
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}