"use client";

import React from "react";
import { DishInfo } from "@zotmeal/api";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import FoodDialogContent from "../food-dialog-content"
import Image from "next/image";
import { Card, CardContent } from "../shadcn/card"; 
import { Star, Utensils } from "lucide-react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";

interface FoodCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  dish: DishInfo;
}

const FoodCardContent = React.forwardRef<
  HTMLDivElement,
  FoodCardContentProps
>(({ dish, ...divProps }, ref) => {
  const IconComponent = getFoodIcon(dish.name) || Utensils;

  return (
    <div ref={ref} {...divProps} className="w-full"> 
      <Card className="cursor-pointer hover:shadow-lg transition w-full">
        <CardContent>
          <div className="flex justify-between h-full pt-6">
            <div className="flex items-center gap-6">
              {IconComponent && <IconComponent className="w-10 h-10 text-slate-700" />}
              <div className="flex flex-col h-full">
                <strong>{formatFoodName(dish.name)}</strong>
                <div className="flex gap-2 items-center">
                  <span>{dish.nutritionInfo.calories == null ? "-" : `${dish.nutritionInfo.calories} cal`}</span>
                  {/* <div className="flex gap-1 items-center">
                    <Star className="w-4 stroke-zinc-400 stroke-2"></Star>
                    <span className="text-zinc-400 text-sm text-center">
                      {4.5} ({100})
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col justify-center">
              <Star className="w-8 h-8 stroke-zinc-400"></Star>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
FoodCardContent.displayName = "FoodCardContent";

export default function FoodCard(dish: DishInfo) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent dish={dish}/>
        </DialogTrigger>
        <FoodDialogContent {... dish}/>
      </Dialog>
    )
}