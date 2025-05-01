"use client"; // Need state for toggling nutrient visibility

import { Pin, Star } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from "./dialog";
import Image from "next/image";
import React, { useState } from "react"; // Import useState
import { Button } from "./button"; // Import Button
import { cn } from "@/utils/tw"; // Import cn utility
import { nutrientToUnit, formatNutrientLabel, formatFoodName } from "@/utils/types";
import { DishInfo } from "@zotmeal/api";
import { toTitleCase } from "@/utils/funcs";


export default function FoodDialogContent(dish: DishInfo) {
  // State to control nutrient visibility
  const [showAllNutrients, setShowAllNutrients] = useState(false);
  const initialNutrients = ['calories', 'totalFatG', 'totalCarbsG', 'proteinG', 'sugarsMg']; // Define which nutrients to show initially
  const recognizedNutrients = initialNutrients.concat(['transFatG', 'saturatedFatG', 'cholesterolMg', 'sodiumMg', 'calciumMg', 'ironMg'])

  return (
    <DialogContent>
      <DialogHeader>
        <div className="flex flex-col gap-6">
          <Image
            src={"/Zotmeal-Logo.webp"}
            alt={"An image of zotmeal logo."}
            width={600}
            height={600}
            className="w-full h-48 object-cover"
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-12 px-4 items-center" id="food-header-info">
              <div className="flex gap-3 items-center">
                <DialogTitle className="text-3xl">{formatFoodName(dish.name)}</DialogTitle>
                <Pin className="stroke-zinc-500"/>
              </div>
              <div className="flex gap-2">
                <Star className="stroke-zinc-500" size={26}/>
                <Star className="stroke-zinc-500" size={26}/>
                <Star className="stroke-zinc-500" size={26}/>
                <Star className="stroke-zinc-500" size={26}/>
                <Star className="stroke-zinc-500" size={26}/>
              </div>
            </div>
            <div className="px-4 text-zinc-500">
              <span>{dish.nutritionInfo.calories == null ? "-" : `${dish.nutritionInfo.calories} cal`} • {toTitleCase(dish.restaurant)}</span>
            </div>
            <DialogDescription className="text-black px-4">{dish.description}</DialogDescription>
            <div>
              <h1 className="px-4 text-2xl font-bold">Nutrients</h1>
              <div className="grid grid-cols-2 gap-x-4 w-full px-4 text-black mb-4" id="nutrient-content">
                {Object.keys(dish.nutritionInfo)
                  .filter(key => recognizedNutrients.includes(key))
                  .map(nutrient => {
                    // Assert that 'nutrient' is a valid key of nutritionInfo
                    const nutrientKey = nutrient as keyof typeof dish.nutritionInfo;
                    const value = dish.nutritionInfo[nutrientKey]; // Now correctly typed
                    const isInitial = initialNutrients.includes(nutrientKey); // Use nutrientKey here too for consistency
                    return (
                      <div
                        key={nutrientKey}
                        className={cn(
                          "grid grid-cols-subgrid col-span-2 transition-all duration-500 ease-in-out overflow-hidden", // Base styles for transition
                          !isInitial && !showAllNutrients ? "max-h-0 opacity-0 py-0" : "max-h-8 opacity-100 py-0.5" // Conditional styles for collapse/expand
                        )}
                      >
                        <strong className="col-span-1">{formatNutrientLabel(nutrientKey)}</strong>
                        <span className="col-span-1 text-right">
                          {value == null ? "-" : `${String(value)}${nutrientToUnit[nutrientKey]}`}
                          </span>
                      </div>
                    );
                  })}
              </div>
              <div className="px-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllNutrients(!showAllNutrients)}
                >
                  {showAllNutrients ? "Show Less" : "Show More Nutrients"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogHeader>     
    </DialogContent>
  )
}