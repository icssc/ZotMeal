import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./shadcn/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./shadcn/hover-card"

/**
 * Props for the {@link Contributor} component.
 */
interface ContributorProps {
    /**
     * The full name of the contributor.
     */
    name: string;
    /**
     * The GitHub username of the contributor.
     */
    username: string;
    /**
     * The URL to the contributor's profile picture.
     */
    profileSrc: string;
    /**
     * A short biography or description of the contributor.
     */
    bio: string;
}

/**
 * Renders a contributor's avatar that, on hover, displays a card with more details
 * including their name, GitHub username (linked), profile picture, and bio.
 * @param {ContributorProps} props - The properties for the contributor display.
 * @returns {JSX.Element} The rendered contributor component with hover card functionality.
 */
export default function Contributor({
  name,
  username, 
  profileSrc, 
  bio
} : ContributorProps): JSX.Element {
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