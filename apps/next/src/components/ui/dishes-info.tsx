'use client';

import React, { useState } from "react";
import MealDivider from "./meal-divider"
import FoodCard, { FoodCardProps } from "./food-card" // Import FoodCardProps type
import FoodCardSkeleton from "./food-card-skeleton"
import MealDividerSkeleton from "./meal-divider-skeleton"
import { trpc } from "@/utils/trpc"; // Import tRPC hook
import { HallEnum, MealTimeEnum } from "@/utils/types";
import { RestaurantInfo } from "@zotmeal/api";

interface DishesInfoProps {
  hall: HallEnum,
  station: string,
  mealTime: MealTimeEnum
}

export default function DishesInfo({hall, station, mealTime} : DishesInfoProps) { 
  const [queryDate] = useState(() => new Date())

  const { data: queryResponse, isLoading, isError, error } = trpc.zotmeal.useQuery(
    {date: queryDate},
    {staleTime: 2 * 60 * 60 * 1000} // 2 hour stale time
  );

  let hallData = hall == HallEnum.ANTEATERY 
              ? queryResponse?.anteatery
              : queryResponse?.brandywine

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
          {hallData![0].period.name}<br/>
          {station}<br/>
          {mealTime}<br/>
          {hallData![0].stations.flatMap(station => {
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