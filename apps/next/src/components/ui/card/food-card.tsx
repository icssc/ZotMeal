"use client";

import React, { useState } from "react";
import { DishInfo } from "@zotmeal/api";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import FoodDialogContent from "../food-dialog-content";
import { Card, CardContent } from "../shadcn/card";
import { Star, Utensils } from "lucide-react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerTrigger } from "../shadcn/drawer";
import FoodDrawerContent from "../food-drawer-content";
import { useAverageRating } from "@/hooks/useAverageRating";

/**
 * Props for the FoodCardContent component.
 */
interface FoodCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The dish information to display.
   */
  dish: DishInfo;
}

/**
 * Component to display a single star that can show full, half, or empty
 */
const StarIcon = ({
  fillAmount,
  onClick,
  onHover,
  isHovering,
}: {
  fillAmount: number; // 0, 0.5, or 1
  onClick: () => void;
  onHover: () => void;
  isHovering: boolean;
}) => {
  if (fillAmount === 0) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onHover}
        className="cursor-pointer hover:scale-110 transition-transform relative"
      >
        <Star className="w-5 h-5 stroke-zinc-300 stroke-2" />
      </button>
    );
  }

  if (fillAmount === 0.5) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onHover}
        className="cursor-pointer hover:scale-110 transition-transform relative"
      >
        <Star className="w-5 h-5 stroke-amber-400 stroke-2 absolute" />
        <div className="overflow-hidden w-1/2">
          <Star className="w-5 h-5 fill-amber-400 stroke-amber-400 stroke-2" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className="cursor-pointer hover:scale-110 transition-transform"
    >
      <Star className="w-5 h-5 fill-amber-400 stroke-amber-400 stroke-2" />
    </button>
  );
};

/**
 * Component to display and interact with star rating
 */
const StarRating = ({
  rating,
  count,
  foodName,
  userRating,
  onRatingClick,
}: {
  rating: number;
  count: number;
  foodName: string;
  userRating: number | null;
  onRatingClick: (stars: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStarClick = (e: React.MouseEvent, stars: number) => {
    e.stopPropagation(); // Prevent card dialog from opening
    onRatingClick(stars);
  };

  const handleStarHover = (stars: number) => {
    setHoverRating(stars);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  // Determine which rating to display:
  // 1. If hovering, show hover rating
  // 2. If user has rated, show user's rating
  // 3. Otherwise show average rating
  const displayRating =
    hoverRating !== null ? hoverRating : userRating || rating;

  const getStarFillAmount = (starPosition: number): number => {
    const diff = displayRating - starPosition;
    if (diff >= 0) return 1; // Full star
    if (diff >= -0.5) return 0.5; // Half star
    return 0; // Empty star
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className="flex gap-0.5 items-center"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starPosition) => {
          return (
            <div key={starPosition} className="relative flex">
              {/* Left half of star (for 0.5 ratings) */}
              <div
                className="w-1/2 h-full absolute left-0 z-10"
                onClick={(e) => handleStarClick(e, starPosition - 0.5)}
                onMouseEnter={() => handleStarHover(starPosition - 0.5)}
              />
              {/* Right half of star (for full ratings) */}
              <div
                className="w-1/2 h-full absolute right-0 z-10"
                onClick={(e) => handleStarClick(e, starPosition)}
                onMouseEnter={() => handleStarHover(starPosition)}
              />

              <StarIcon
                fillAmount={getStarFillAmount(starPosition)}
                onClick={() => {}}
                onHover={() => {}}
                isHovering={false}
              />
            </div>
          );
        })}
      </div>
      {count > 0 && (
        <span className="text-xs text-zinc-400">
          {rating.toFixed(1)} ({count})
        </span>
      )}
      {userRating !== null && (
        <span className="text-xs text-amber-500">
          Your Rating: {userRating}
        </span>
      )}
    </div>
  );
};

/**
 * FoodCardContent component displays the visual representation of a food item within a card.
 * It shows the food's name, icon, calories, and rating.
 * This component is intended to be used as a trigger for a dialog showing more details.
 */
const FoodCardContent = React.forwardRef<HTMLDivElement, FoodCardContentProps>(
  ({ dish, onOpenDetails, ...divProps }, ref) => {
    const IconComponent = getFoodIcon(dish.name) ?? Utensils;
    const { averageRating, ratingCount, userRating, isLoading, submitRating } =
      useAverageRating(dish.name);

    const handleRatingSubmit = async (stars: number) => {
      await submitRating(stars);
    };

    return (
      <div ref={ref} {...divProps} className="w-full">
        <Card className="cursor-pointer hover:shadow-lg transition w-full">
          <CardContent>
            <div className="flex justify-between items-center h-full pt-6">
              <div className="flex items-center gap-6">
                {IconComponent && (
                  <IconComponent className="w-10 h-10 text-slate-700" />
                )}
                <div className="flex flex-col">
                  <strong>{formatFoodName(dish.name)}</strong>
                  <span className="text-zinc-600 text-sm">
                    {dish.nutritionInfo.calories == null
                      ? "—"
                      : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
                  </span>
                </div>
              </div>
              {!isLoading && (
                <StarRating
                  rating={averageRating}
                  count={ratingCount}
                  foodName={dish.name}
                  userRating={userRating}
                  onRatingClick={handleRatingSubmit}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);
FoodCardContent.displayName = "FoodCardContent";

/**
 * A Client Component that renders an interactive food card.
 * Clicking the card opens a dialog with full dish details.
 *
 * This component combines an `FoodCardContent` (the visual card) with a
 * `Dialog` and {@link FoodDialogContent} (the full dish details dialog).
 *
 * @param {DishInfo} dish - The dish information to display and pass to the dialog.
 * @returns {JSX.Element} A React component representing a food card.
 */
export default function FoodCard(dish: DishInfo): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent dish={dish} />
        </DialogTrigger>
        <FoodDialogContent {...dish} />
      </Dialog>
    );
  else
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <FoodCardContent dish={dish} />
        </DrawerTrigger>
        <FoodDrawerContent {...dish} />
      </Drawer>
    );
}
