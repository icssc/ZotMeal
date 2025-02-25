import { Pin, Star } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from "./dialog";
import Image from "next/image";
import { FoodCardProps } from "./food-card";
import React from "react";

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
              <div className="grid grid-cols-2 gap-y-1 w-full px-4 text-black" id="nutrient-content">
                {Object.entries(info).map(([nutrient, value]) => (
                  <React.Fragment key={nutrient}>
                    <strong>{formatNutrientLabel(nutrient)}</strong>
                    <span className="text-right">{value}{nutrientToUnit[nutrient]}</span> 
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogHeader>     
    </DialogContent>
  )
}