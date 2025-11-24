"use client"; // Need state for toggling nutrient visibility

import { Pin, Star } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "./shadcn/dialog";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./shadcn/button";
import { cn } from "@/utils/tw";
import { nutrientToUnit } from "@/utils/types";
import {
  formatFoodName,
  formatNutrientLabel,
  formatNutrientValue,
} from "@/utils/funcs";
import { DishInfo } from "@zotmeal/api";
import { toTitleCase, enhanceDescription } from "@/utils/funcs";
import { AllergenBadge } from "./allergen-badge";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import IngredientsDialog from "../ingredients-dialog";

/**
 * Interactive star rating component for rating food items
 */
const InteractiveStarRating = ({ dishName }: { dishName: string }) => {
  const [userRating, setUserRating] = useState<number>(0); // User's rating (0-5)
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStarClick = (stars: number) => {
    setUserRating(stars);
    // samika TODO: Call tRPC mutation when implemented
    // await api.ratings.addRating.mutate({ foodName: dishName, rating: stars });
    console.log(`Rated ${dishName} with ${stars} stars`);
  };

  const displayRating = hoverRating ?? userRating;

  const getStarFillAmount = (starPosition: number): number => {
    const diff = displayRating - starPosition;
    if (diff >= 0) return 1; // Full star
    if (diff >= -0.5) return 0.5; // Half star
    return 0; // Empty star
  };

  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((starPosition) => {
        const fillAmount = getStarFillAmount(starPosition);

        return (
          <div
            key={starPosition}
            className="relative flex"
            onMouseLeave={() => setHoverRating(null)}
          >
            {/* Left half - for 0.5 ratings */}
            <div
              className="w-1/2 h-full absolute left-0 z-10 cursor-pointer"
              onClick={() => handleStarClick(starPosition - 0.5)}
              onMouseEnter={() => setHoverRating(starPosition - 0.5)}
            />
            {/* Right half - for full ratings */}
            <div
              className="w-1/2 h-full absolute right-0 z-10 cursor-pointer"
              onClick={() => handleStarClick(starPosition)}
              onMouseEnter={() => setHoverRating(starPosition)}
            />

            {fillAmount === 0 && (
              <Star
                className="w-7 h-7 stroke-zinc-400 hover:stroke-amber-400 transition-colors"
                strokeWidth={1}
              />
            )}
            {fillAmount === 0.5 && (
              <>
                <Star
                  className="w-7 h-7 stroke-amber-400 absolute"
                  strokeWidth={1}
                />
                <div className="overflow-hidden w-1/2">
                  <Star
                    className="w-7 h-7 fill-amber-400 stroke-amber-400"
                    strokeWidth={1}
                  />
                </div>
              </>
            )}
            {fillAmount === 1 && (
              <Star
                className="w-7 h-7 fill-amber-400 stroke-amber-400"
                strokeWidth={1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * `FoodDialogContent` renders the detailed view of a food item (dish) within a dialog.
 * It displays the dish's image (placeholder for now), name, calories, restaurant,
 * dietary restriction badges (e.g., vegetarian, vegan), a description,
 * and a collapsible list of nutritional information.
 *
 * Users can toggle the visibility of the full nutrient list.
 *
 * This component is typically used as the content for a `Dialog` triggered by a {@link FoodCard}.
 *
 * @param {DishInfo} dish - The dish data to display. See {@link DishInfo} (from `@zotmeal/api`) for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the food item dialog.
 */
export default function FoodDialogContent(dish: DishInfo): JSX.Element {
  const [showAllNutrients, setShowAllNutrients] = useState(false);
  const initialNutrients = [
    "calories",
    "totalFatG",
    "totalCarbsG",
    "proteinG",
    "sugarsG",
  ]; // Define which nutrients to show initially
  const recognizedNutrients = initialNutrients.concat([
    "transFatG",
    "saturatedFatG",
    "cholesterolMg",
    "sodiumMg",
    "calciumMg",
    "ironMg",
  ]);

  const ingredientsAvailable: boolean =
    dish.ingredients != "Ingredient Statement Not Available";

  return (
    <DialogContent>
      <DialogHeader>
        <div className="flex flex-col gap-6">
          <Image
            src={"/zm-card-header.webp"}
            alt={"An image of zotmeal logo."}
            width={1200}
            height={700}
            className="w-full h-48 object-cover"
          />
          <div className="flex flex-col gap-2">
            <div
              className="flex justify-between px-4 items-center"
              id="food-header-info"
            >
              <div className="flex gap-3 items-center">
                <DialogTitle className="text-3xl">
                  {formatFoodName(dish.name)}
                </DialogTitle>
                {/* <Pin className="stroke-zinc-500"/> */}
              </div>
              {/* Interactive rating stars - right aligned */}
              <InteractiveStarRating dishName={dish.name} />
            </div>
            <div className="px-4 flex items-center gap-2 text-zinc-500">
              <span>
                {dish.nutritionInfo.calories == null
                  ? "-"
                  : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
              </span>
              <span>•</span>
              <span>{toTitleCase(dish.restaurant)}</span>
              {dish.dietRestriction.isVegetarian && (
                <AllergenBadge variant={"vegetarian"} />
              )}
              {dish.dietRestriction.isVegan && (
                <AllergenBadge variant={"vegan"} />
              )}
              {dish.dietRestriction.isGlutenFree && (
                <AllergenBadge variant={"gluten_free"} />
              )}
              {dish.dietRestriction.isKosher && (
                <AllergenBadge variant={"kosher"} />
              )}
            </div>
            <DialogDescription className="text-black px-4">
              {enhanceDescription(dish.name, dish.description)}
            </DialogDescription>
            <div>
              <h1 className="px-4 text-2xl font-bold">Nutrients</h1>
              <div
                className="grid grid-cols-2 gap-x-4 w-full px-4 text-black mb-4"
                id="nutrient-content"
              >
                {Object.keys(dish.nutritionInfo)
                  .filter((key) => recognizedNutrients.includes(key))
                  .map((nutrient) => {
                    // Assert that 'nutrient' is a valid key of nutritionInfo
                    const nutrientKey =
                      nutrient as keyof typeof dish.nutritionInfo;
                    const value = dish.nutritionInfo[nutrientKey]; // Now correctly typed
                    const formattedValue = formatNutrientValue(
                      nutrientKey,
                      value,
                    );
                    const isInitial = initialNutrients.includes(nutrientKey); // Use nutrientKey here too for consistency
                    return (
                      <div
                        key={nutrientKey}
                        className={cn(
                          "grid grid-cols-subgrid col-span-2 transition-all duration-500 ease-in-out overflow-hidden", // Base styles for transition
                          !isInitial && !showAllNutrients
                            ? "max-h-0 opacity-0 py-0"
                            : "max-h-8 opacity-100 py-0.5", // Conditional styles for collapse/expand
                        )}
                      >
                        <strong className="col-span-1">
                          {formatNutrientLabel(nutrientKey)}
                        </strong>
                        <span className="col-span-1 text-right">
                          {value == null
                            ? "-"
                            : `${String(formattedValue)} ${nutrientToUnit[nutrientKey]}`}
                        </span>
                      </div>
                    );
                  })}
              </div>
              <div className="px-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllNutrients(!showAllNutrients)}
                >
                  {showAllNutrients ? "Show Less" : "Show More Nutrients"}
                </Button>
                {ingredientsAvailable && (
                  <IngredientsDialog
                    name={dish.name}
                    ingredients={dish.ingredients!}
                  />
                )}
                {!ingredientsAvailable && (
                  <Button variant="deactivated">
                    Ingredients Not Available
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
