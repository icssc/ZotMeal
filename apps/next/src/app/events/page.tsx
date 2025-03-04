import EventCard, { EventLocation } from "@/components/ui/event-card"
import MealDivider from "@/components/ui/meal-divider"
import Image from "next/image"

export default function Events() {
    return (
      <div className="flex flex-col items-center">
        <Image
        className="object-cover w-full min-h-80 max-h-80"
        src="/uci.webp"
        alt="An Image of UCI's signage."
        width={2000}
        height={2000}
        />
        <div className="flex flex-col gap-4 justify-center w-full px-12 py-8">
          <MealDivider title="This Week"/>
          <EventCard
             name="Nashville Hot Chicken"
             shortDesc="Turn up the heat with our bold Nashville specialty! Each crispy, spicy bite brings Southern fire to your taste buds."
             longDesc="The Anteatery drops the heat with our Nashville Hot Chicken Sandwich! Savor our perfectly crispy chicken, seasoned with fiery Nashville-style spices, served on a soft bun and accompanied by classic Southern sides. Experience the bold, spicy flavors that made Nashville famous."
             imgSrc="/Zotmeal-Logo.webp"
             alt="Zotmeal logo."
             time={new Date(2025, 0, 3, 13, 0, 0, 0)}
             location={EventLocation.ANTEATERY}
          />
        </div>
      </div>
    )
}