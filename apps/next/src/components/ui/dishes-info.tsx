'use client';

import React from "react";
import FoodCard from "./card/food-card"
import FoodCardSkeleton from "./skeleton/food-card-skeleton"
import MealDividerSkeleton from "./skeleton/meal-divider-skeleton"
import { DishInfo } from "@zotmeal/api";

interface DishesInfoProps {
  dishes: DishInfo[],
  isLoading: boolean,
  isError: boolean,
  errorMessage?: string
}

export default function DishesInfo({dishes, isLoading, isError, errorMessage} : DishesInfoProps) { 
  return (
    <div className="flex flex-col gap-6 mt-10 px-2 overflow-y-auto 
      flex-grow h-1" 
      id="food-scroll">
      {isLoading && (
        // Show skeletons while loading
        <>
          <MealDividerSkeleton/>
          <FoodCardSkeleton/>
          <FoodCardSkeleton/>
          <FoodCardSkeleton/>
          <MealDividerSkeleton/>
          <FoodCardSkeleton/>
        </>
      )}

      {isError && (
        <p className="text-red-500 w-full text-center">Error loading data: {errorMessage}</p>
      )}

      {!isLoading && !isError && (
        <> 
          {(() => {
            if (!dishes) {
              return (
                <p className="text-center text-gray-500">
                  Dining hall data not found for the selected hall.
                </p>
              );
            }

            return (
              <>
                {dishes.map(dish => (
                  <FoodCard key={dish.id} {... dish}/>
                ))}
              </>
            );
          })()}
        </>
      )}

    </div>
  );
}