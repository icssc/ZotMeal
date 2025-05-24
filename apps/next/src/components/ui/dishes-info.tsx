'use client';

import React from "react";
import FoodCard from "./card/food-card"
import FoodCardSkeleton from "./skeleton/food-card-skeleton"
import MealDividerSkeleton from "./skeleton/meal-divider-skeleton"
import { DishInfo } from "@zotmeal/api";
import MealDivider from "./meal-divider";
import { sortCategoryKeys } from "@/utils/funcs";

interface DishesInfoProps {
  dishes: DishInfo[],
  isLoading: boolean,
  isError: boolean,
  errorMessage?: string
}

export default function DishesInfo({dishes, isLoading, isError, errorMessage} : DishesInfoProps) { 
  // Sort the dishes by category string
  let categoryMap: {[dishCategory : string]: DishInfo[]} = {};
  dishes.forEach((dish) => {
    if (dish.category in categoryMap)
      categoryMap[dish.category].push(dish)
    else
      categoryMap[dish.category] = [dish]
  })

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
          {dishes.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No dishes available for this selection.
            </p>
          ) : (
                sortCategoryKeys(Object.keys(categoryMap)).map(categoryString => 
                  <React.Fragment key={`${categoryString}`}>
                    <MealDivider title={categoryString} />
                    {categoryMap[categoryString].map(dish => 
                      <FoodCard key={dish.id} {... dish}/>
                    )}
                  </React.Fragment>
                )
            )}
        </>
      )}

    </div>
  );
}