'use client';
import MealDivider from "./meal-divider"
import FoodCard from "./food-card"
import FoodCardSkeleton from "./food-card-skeleton"
import MealDividerSkeleton from "./meal-divider-skeleton"

interface DishesInfoProps {
  hall: string,
  station: string,
}

export default function DishesInfo({hall, station} : DishesInfoProps) { 
  return (
    <div className="flex flex-col gap-6 mt-10 px-2 overflow-y-auto 
    flex-grow h-1" 
    id="food-scroll">
      <MealDivider title="Entree"/>
      <FoodCard
      title="Chicken Teriyaki"
      description={`Savory grilled chicken glazed in a rich teriyaki 
          sauce, served with steamed rice.`}
      info={{
        calories: 450,
        totalFat: 12,
        transFat: 0,
        saturatedFat: 3,
        cholesterol: 60,
        sodium: 900,
        carbs: 55,
        fiber: 3,
        sugar: 12,
        protein: 35,
        vitaminA: 10,
        vitaminC: 15,
        calcium: 8,
        iron: 20
      }}
      hallInfo={{
        hall: "Brandywine",
        station: "The Crossroads"
      }}
      imgSrc="/Zotmeal-Logo.webp"
      alt="Image of food."
      rating={4.5}
      numRatings={12}
      />
      <MealDividerSkeleton/>
      <FoodCardSkeleton/>
      <FoodCardSkeleton/>
      <FoodCardSkeleton/>
    </div>
  )
}