"use client"; // Need state for toggling nutrient visibility

import { Pin, Star } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from "./dialog";
import Image from "next/image";
import { FoodCardProps } from "./food-card";
import React, { useState } from "react"; // Import useState
import { Button } from "./button"; // Import Button
import { cn } from "@/utils/tw"; // Import cn utility

const formatNutrientLabel = (nutrient: string) => {
  return nutrient
    .replace(/([A-Z])/g, " $1") // Adds a space before uppercase letters
    .replace(/^./, (char) => char.toUpperCase())  // Capitalize first letter
    .trim();
};

const nutrientToUnit : { [nutrient: string]: string } = {
  "calories": "cal",
  "totalFat": "g",
  "transFat": "g",
  "saturatedFat": "g",
  "cholesterol": "mg",
  "sodium": "mg",
  "carbs": "g",
  "fiber": "g",
  "sugar": "g",
  "protein": "g",
  "vitaminA": "% DV",
  "vitaminC": "% DV",
  "calcium": "mg",
  "iron": "mg",
}

export default function FoodDialogContent({
  title,
  description,
  info,
  hallInfo,
  imgSrc,
  alt,
  rating,
  numRatings
}: FoodCardProps) {
  // State to control nutrient visibility
  const [showAllNutrients, setShowAllNutrients] = useState(false);
  const initialNutrients = ['calories', 'totalFat', 'carbs', 'protein', 'sugar']; // Define which nutrients to show initially

  return (
    <DialogContent>
      <DialogHeader>
        <div className="flex flex-col gap-6">
          <Image
            src={imgSrc}
            alt={alt}
            width={600}
            height={600}
            className="w-full h-48 object-cover"
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-12 px-4 items-center" id="food-header-info">
              <div className="flex gap-3 items-center">
                <DialogTitle className="text-3xl">{title}</DialogTitle>
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
            <div className="flex gap-4 px-4  text-zinc-500">
              <span>{info.calories} cal</span>
              <span>{hallInfo.hall} • {hallInfo.station}</span>
            </div>
            <DialogDescription className="text-black px-4">{description}</DialogDescription>
            <div>
              <h1 className="px-4 text-2xl font-bold">Nutrients</h1>
              <div className="grid grid-cols-2 gap-x-4 w-full px-4 text-black mb-4" id="nutrient-content">
                {Object.entries(info)
                  .map(([nutrient, value]) => {
                    const isInitial = initialNutrients.includes(nutrient);
                    return (
                      // Wrapper div for applying transitions to non-initial items
                      <div
                        key={nutrient}
                        className={cn(
                          "grid grid-cols-subgrid col-span-2 transition-all duration-500 ease-in-out overflow-hidden", // Base styles for transition
                          !isInitial && !showAllNutrients ? "max-h-0 opacity-0 py-0" : "max-h-8 opacity-100 py-0.5" // Conditional styles for collapse/expand
                        )}
                      >
                        <strong className="col-span-1">{formatNutrientLabel(nutrient)}</strong>
                        <span className="col-span-1 text-right">{value}{nutrientToUnit[nutrient]}</span>
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