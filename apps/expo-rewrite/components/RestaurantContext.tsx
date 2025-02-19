import { createContext } from "react";
import { ImageSourcePropType } from "react-native";

import { RestaurantInfo, RestaurantName } from "../hooks/useZotmealStore";

export const RestaurantContext = createContext<{
  restaurantName: RestaurantName;
  image: ImageSourcePropType;
  data?: RestaurantInfo;
} | null>(null);
