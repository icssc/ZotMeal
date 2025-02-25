import { Dish } from "../hooks/useZotmealStore";

export function getDishRating(dish: Dish) {
  return dish.numRatings === 0 ? 0 : dish.totalRating / dish.numRatings;
}
