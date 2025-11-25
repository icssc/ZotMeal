"use client";

import FoodCard from "@/components/ui/card/food-card";
import FoodCardSkeleton from "@/components/ui/skeleton/food-card-skeleton";
import MealDivider from "@/components/ui/meal-divider";
import MealDividerSkeleton from "@/components/ui/skeleton/meal-divider-skeleton";
// import { trpc } from "@/utils/trpc"; // commented until backend is ready
import Image from "next/image";

export default function RatedFoods() {
  // Commented out until tRPC is implemented
  /*
  const {
    data: ratedFoods,
    isLoading,
    error,
  } = trpc.food.rated.useQuery();

  const sortedFoods = ratedFoods
    ? [...ratedFoods].sort((a, b) => {
        const dateA = new Date(a.ratedAt);
        const dateB = new Date(b.ratedAt);
        return dateB.getTime() - dateA.getTime(); // newest first
      })
    : [];
  */

  return (
    <div className="max-w-full h-screen">
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        {/* Image banner at the top */}
        <Image
          className="object-cover w-full min-h-80 max-h-80"
          src="/aldrich.webp"
          alt="An Image of Aldrich Park."
          width={2000}
          height={2000}
        />

        <div
          className="flex flex-col gap-4 justify-center w-full p-5 sm:px-12 sm:py-8"
          id="food-scroll"
        >
          {/* Title divider with horizontal line */}
          <MealDivider title="My Rated Foods" />

          {/* Default text for now */}
          <p className="text-center text-zinc-700 py-5">
            You haven’t rated any foods yet
          </p>

          {/* Commented out until backend is ready */}
          {/*
          {isLoading && (
            <>
              <MealDividerSkeleton />
              <FoodCardSkeleton />
              <FoodCardSkeleton />
              <MealDividerSkeleton />
              <FoodCardSkeleton />
            </>
          )}

          {error && (
            <p className="text-red-500 w-full text-center">
              Error loading rated foods: {error.message}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <MealDivider title="My Rated Foods" />
              {sortedFoods.length > 0 ? (
                sortedFoods.map((food: any) => (
                  <FoodCard
                    key={`${food.name}|${food.ratedAt.toISOString()}|${food.id}`}
                    name={food.name}
                    imgSrc={food.image}
                    alt={`${food.name} image.`}
                    rating={food.rating}
                    ratedAt={food.ratedAt}
                    description={food.description}
                  />
                ))
              ) : (
                <p className="text-center text-zinc-700 py-5">
                  You haven’t rated any foods yet
                </p>
              )}
            </>
          )}
          */}
        </div>
      </div>
    </div>
  );
}