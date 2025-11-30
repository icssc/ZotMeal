"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../shadcn/card";
import { Star, Utensils } from "lucide-react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";

interface RatingsCardProps {
  food: {
    id: string;
    name: string;
    description: string | null;
    calories: string | number | null;
    rating: number;
    ratedAt: string | Date;
    station?: {
      name: string;
      restaurant?: {
        name: string;
      };
    } | null;
  };
}

export default function RatingsCard({ food }: RatingsCardProps) {
  const IconComponent = getFoodIcon(food.name) ?? Utensils;
  const utils = trpc.useUtils();
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Fetch average rating like FoodCard does
  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: food.id },
    { staleTime: 5 * 60 * 1000 }
  );
  
  const averageRating = ratingData?.averageRating ?? 0;
  const ratingCount = ratingData?.ratingCount ?? 0;

  const rateDishMutation = trpc.dish.rate.useMutation({
    onSuccess: () => {
      // Invalidate ALL rating-related queries so changes appear everywhere
      utils.dish.rated.invalidate();
      utils.dish.getUserRating.invalidate({ userId: "default-user", dishId: food.id });
      utils.dish.getAverageRating.invalidate({ dishId: food.id });
    },
  });

  const handleRating = async (newRating: number) => {
    try {
      await rateDishMutation.mutateAsync({
        userId: "default-user",
        dishId: food.id,
        rating: newRating,
      });
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  // Capitalize first letter of each word
  const capitalizeRestaurant = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate star fill based on rating
  const getStarFill = (starIndex: number, rating: number) => {
    if (rating >= starIndex) return "full";
    if (rating >= starIndex - 0.5) return "half";
    return "empty";
  };

  const displayRating = hoverRating ?? food.rating;

  return (
    <Card className="hover:shadow-lg transition w-full">
      <CardContent>
        <div className="flex justify-between items-center h-full pt-6">
          {/* Left side - Icon and Content */}
          <div className="flex items-center gap-6">
            {/* Icon */}
            <IconComponent className="w-10 h-10 text-slate-700" />

            {/* Content */}
            <div className="flex flex-col">
              <strong>{formatFoodName(food.name)}</strong>
              
              {/* Calories, Station/Restaurant info, and Average Rating */}
              <div className="flex gap-2 items-center flex-wrap">
                {food.calories != null && (
                  <span className="text-zinc-600 text-sm">
                    {Math.round(parseFloat(food.calories.toString()))} cal
                  </span>
                )}
                {food.calories != null && food.station?.name && (
                  <span className="text-zinc-400 text-sm">•</span>
                )}
                {food.station?.name && (
                  <span className="text-zinc-600 text-sm">
                    {food.station.name}
                  </span>
                )}
                {food.station?.restaurant?.name && (
                  <>
                    <span className="text-zinc-400 text-sm">•</span>
                    <span className="text-zinc-600 text-sm">
                      {capitalizeRestaurant(food.station.restaurant.name)}
                    </span>
                  </>
                )}
                {/* Average rating display like FoodCard */}
                {ratingCount > 0 && (
                  <>
                    <span className="text-zinc-400 text-sm">•</span>
                    <div className="flex gap-1 items-center">
                      <Star className="w-4 h-4 stroke-zinc-200" strokeWidth={1} />
                      <span className="text-zinc-400 text-sm">
                        {averageRating.toFixed(1)} ({ratingCount})
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Rated date */}
              <span className="text-zinc-400 text-xs mt-1">
                Rated {new Date(food.ratedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Right side - Interactive Stars */}
          <div className="flex flex-col items-end justify-center ml-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const fillType = getStarFill(star, displayRating);
                
                return (
                  <div
                    key={star}
                    className="relative cursor-pointer"
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    {/* Half star implementation using two clickable areas */}
                    {fillType === "half" ? (
                      <>
                        {/* Left half - filled */}
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                          <Star
                            className="w-5 h-5 fill-yellow-400 stroke-yellow-400"
                            strokeWidth={1}
                          />
                        </div>
                        {/* Right half - empty */}
                        <Star
                          className="w-5 h-5 stroke-gray-300"
                          strokeWidth={1}
                        />
                      </>
                    ) : (
                      <Star
                        className={`w-5 h-5 transition-all hover:scale-110 ${
                          fillType === "full"
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "stroke-gray-300 hover:stroke-yellow-400"
                        }`}
                        strokeWidth={1}
                      />
                    )}
                    
                    {/* Clickable areas for left half (0.5) and right half (1.0) */}
                    <div className="absolute inset-0 flex">
                      <div
                        className="w-1/2 h-full"
                        onMouseEnter={() => setHoverRating(star - 0.5)}
                        onClick={() => handleRating(star - 0.5)}
                      />
                      <div
                        className="w-1/2 h-full"
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => handleRating(star)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}