 "use client";

import React from "react"; // Import React for forwardRef
import Image from "next/image"
import { Card, CardContent} from "./card"
import { Star } from "lucide-react"
import { DishInfo } from "@zotmeal/api";
import { formatFoodName } from "@/utils/types";

interface FoodCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  dish: DishInfo;
}

// Use forwardRef on a wrapper div that DialogTrigger can interact with reliably.
// Render the original Card structure inside this wrapper.
const FoodCardContent = React.forwardRef<
  HTMLDivElement,
  FoodCardContentProps
>(({ dish, ...divProps }, ref) => { 
  return (
    <div ref={ref} {...divProps}> 
      <Card className="cursor-pointer hover:shadow-lg transition">
        <CardContent>
          <div className="flex justify-between h-full pt-6">
            <div className="flex items-center gap-6">
              <Image
                src={"/Zotmeal-Logo.webp"}
                alt={"An image of zotmeal logo."}
                width={84}
                height={84}
                className="rounded-sm"
              />
              <div className="flex flex-col h-full">
                <strong>{formatFoodName(dish.name)}</strong>
                  <div className="flex gap-2 items-center">
                    <span>{dish.nutritionInfo.calories == null ? "-" : `${dish.nutritionInfo.calories} cal`}</span>
                      <div className="flex gap-1 items-center">
                        <Star className="w-4 stroke-zinc-400 stroke-2"></Star>
                        <span className="text-zinc-400 text-sm text-center">
                          {4.5} ({100})
                        </span>
                      </div>
                  </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <Star className="w-8 h-8 stroke-zinc-400"></Star>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
FoodCardContent.displayName = "FoodCardContent"; 
export default FoodCardContent;
