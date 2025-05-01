'use client';

import React, { useState } from "react";
import MealDivider from "./meal-divider"
import FoodCard, { FoodCardProps } from "./food-card" // Import FoodCardProps type
import FoodCardSkeleton from "./food-card-skeleton"
import MealDividerSkeleton from "./meal-divider-skeleton"
import { trpc } from "@/utils/trpc"; // Import tRPC hook
import { HallEnum, MealTimeEnum } from "@/utils/types";
import { RestaurantInfo } from "@zotmeal/api";
import { toTitleCase } from "@/utils/funcs";

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

      {!isLoading && !isError && queryResponse && (
        <> 
          {(() => {
            const hallData: RestaurantInfo | undefined = hall === HallEnum.ANTEATERY
              ? queryResponse.anteatery
              : queryResponse.brandywine;

            if (!hallData) {
              return (
                <p className="text-center text-gray-500">
                  Dining hall data not found for the selected hall.
                </p>
              );
            }

            // Get the current selected menu from the menus available
            const currentMenu = hallData.menus.find(menu =>  {
              return menu.period.name.toLowerCase() == 
                MealTimeEnum[mealTime].toLowerCase();
            })

            // Add a check to ensure the menu for the mealtime was found
            if (!currentMenu) {
              return (
                <p className="text-center text-gray-500">
                  Menu for {toTitleCase(MealTimeEnum[mealTime])} not found in {toTitleCase(hallData.name)}.
                </p>
              );
            }

            const currentStation = currentMenu?.stations.find(stationEntry => {
              return stationEntry.name.toLowerCase() == station.toLowerCase();
            })
            
            if (!currentStation) {
              return (
                <p className="text-center text-gray-500">
                  Station '{toTitleCase(station)}' not found in the {toTitleCase(MealTimeEnum[mealTime])} menu.
                </p>
              );
            }

            return (
              <>
                {currentStation.dishes.map(dish => (
                  <p key={dish.name}>{dish.name}</p>
                ))}
              </>
            );
          })()}
        </>
      )}

    </div>
  );
}

/*
// Previous attempt with IIFE directly returning a div, causing type issues:
      {!isLoading && !isError && queryResponse && (
        (() => {
          return (
            <div>
            </div>
          )
        })
      )}
*/