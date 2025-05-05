"use client";

import EventCard from "@/components/ui/event-card"
import EventCardSkeleton from "@/components/ui/event-card-skeleton"
import MealDivider from "@/components/ui/meal-divider"
import MealDividerSkeleton from "@/components/ui/meal-divider-skeleton";
import { trpc } from "@/utils/trpc";
import { HallEnum } from "@/utils/types";
import Image from "next/image"

export default function Events() {
  // Destructure the result from useQuery
  const { data: upcomingEvents, isLoading, error } = trpc.event.upcoming.useQuery();

  return (
    <div className="max-w-full h-screen">
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <Image
        className="object-cover w-full min-h-80 max-h-80"
        src="/uci.webp"
        alt="An Image of UCI's signage."
        width={2000}
        height={2000}
        />
        <div className="flex flex-col gap-4 justify-center w-full px-12 py-8" id="event-scroll">
          {/* Show skeletons while loading */}
          {isLoading && (
            <>
              <MealDividerSkeleton/>
              <EventCardSkeleton/>
              <EventCardSkeleton/>
              <MealDividerSkeleton/>
              <EventCardSkeleton/>
            </>
          )}
          {/* Map over the fetched events once loaded */}
          {!isLoading && upcomingEvents.map((event : any) => (
            <EventCard
              key={`${event.title}|${event.start.toISOString()}|${event.restaurantId}`}
              name={event.title}
              imgSrc={event.image}
              alt={`${event.title} promotion image.`}
              time={event.start}
              location={event.restaurantId == 3056 ? HallEnum.ANTEATERY : HallEnum.BRANDYWINE}
              shortDesc={event.shortDescription}
              longDesc={event.longDescription}
            />
          ))}
        </div>
      </div>
    </div>
  )
}