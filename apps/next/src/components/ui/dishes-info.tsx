'use client';

import React, { useState } from "react";
import MealDivider from "./meal-divider"
import FoodCard, { FoodCardProps } from "./food-card" // Import FoodCardProps type
import FoodCardSkeleton from "./food-card-skeleton"
import MealDividerSkeleton from "./meal-divider-skeleton"
import { trpc } from "@/utils/trpc"; // Import tRPC hook

interface DishesInfoProps {
  hall: string,
  station: string,
}

export default function DishesInfo({hall, station} : DishesInfoProps) { 
  const [queryDate] = useState(() => new Date())

  const { data: queryResponse, isLoading, isError, error } = trpc.zotmeal.useQuery(
    {date: queryDate},
    {staleTime: 5 * 60 * 1000} // 5 minute stale time
  );

  // Placeholder for actual data processing - remove this line
  const zotMealData = queryResponse?.anteatery?.menus!

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
        <p className="text-red-500">Error loading data: {error?.message}</p>
      )}

      {/* Only try to access and render data if not loading and no error */}
      {!isLoading && !isError && queryResponse && (
        <pre className="text-xs whitespace-pre-wrap break-words">
          {zotMealData[0].stations.flatMap(station => {
            return (
              <div key={station.name}>
                <h3 className='font-bold text-xl'>{station.name}</h3>
                <ul>
                  {station.dishes.map(dish => {
                    return(
                      <li key={dish.name}>{dish.name}</li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </pre>
      )}

    </div>
  )
}