"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../shadcn/card";
import { Star, Utensils, Trash2 } from "lucide-react";
import { Button } from "../shadcn/button";
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

  const deleteRatingMutation = trpc.dish.deleteRating.useMutation({
    onSuccess: () => {
      // Invalidate queries to remove the deleted rating from the list/UI
      console.log("Rating deleted successfully, invalidating queries.");
      utils.dish.rated.invalidate(); 
      utils.dish.getUserRating.invalidate({ userId: "default-user", dishId: food.id });
      utils.dish.getAverageRating.invalidate({ dishId: food.id });
    },
    onError: (error) => {
      console.error("Error deleting rating:", error);
      alert("Failed to delete rating: " + error.message);
    }
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      try {
        await deleteRatingMutation.mutateAsync({
          userId: "default-user", // REPLACE with actual user ID logic
          dishId: food.id,
        });
      } catch (error) {
      }
    }
  };

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
        <div className="flex justify-between items-start h-full pt-6">
          
          <div className="flex items-center gap-6">
            <IconComponent className="w-10 h-10 text-slate-700" />
            <div className="flex flex-col">
              <strong>{formatFoodName(food.name)}</strong>
              <div className="flex gap-2 items-center flex-wrap">
              </div>
              <span className="text-zinc-400 text-xs mt-1">
                Rated {new Date(food.ratedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center ml-4 gap-4"> 
            
            {/* Stars Container */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const fillType = getStarFill(star, displayRating);
                
                return (
                  <div
                    key={star}
                    className="relative cursor-pointer"
                    onMouseLeave={() => setHoverRating(null)}
                  >
                     {fillType === "half" ? (
                      <>
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                          <Star
                            className="w-7 h-7 fill-yellow-400 stroke-yellow-400"
                            strokeWidth={1}
                          />
                        </div>
                        <Star
                          className="w-7 h-7 stroke-gray-300"
                          strokeWidth={1}
                        />
                      </>
                    ) : (
                      <Star
                        className={`w-7 h-7 transition-all hover:scale-110 ${
                          fillType === "full"
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "stroke-gray-300 hover:stroke-yellow-400"
                        }`}
                        strokeWidth={1}
                      />
                    )}
                    
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
            
            {/* Delete Button (Now horizontally next to the stars) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 h-fit text-gray-400 hover:text-red-500"
              disabled={deleteRatingMutation.isLoading}
              title="Delete Rating"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}