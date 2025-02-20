import ZotMealCard from "@/components/ui/zm-card";
import Image from "next/image";

export default function Home() {
  return (
      <ZotMealCard 
        title="Chicken Teriyaki"
        calories={110}
        imgSrc="/Zotmeal-Logo.webp"
        alt="An image of food."
        rating={4.7}
        numRatings={1231}>
      </ZotMealCard>
  );
}
