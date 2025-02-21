import Side from "@/components/ui/side";

export default function Home() {
  return (
    <>
      <Side
        heroImageSrc="/brandywine.webp"
        heroImageAlt="An image of the front of the Brandywine dining hall at UCI."
        mealTimes={["Breakfast", "Lunch", "Dinner", "Latenite"]}
        openTime="8:00a"
        closeTime="8:00p"
        stations={["Grubb", "The Crossroads", "The Twisted Root", "Emnber", "Hearth", "The Farm Stand"]}
      />
      <Side
        heroImageSrc="/anteatery.webp"
        heroImageAlt="An image of the front of the Brandywine dining hall at UCI."
        mealTimes={["Breakfast", "Lunch", "Dinner", "Latenite"]}
        openTime="8:00a"
        closeTime="8:00p"
        stations={["Home", "Fire & Ice", "Noodle Bar", "The Twisted Root", "Sizzle Grill", "The Oven"]}
      />
    </>
  );
}
