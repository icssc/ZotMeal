import { createContext } from "react";
import { ImageSourcePropType } from "react-native";
import { SharedValue } from "react-native-reanimated";

import { RestaurantInfo, RestaurantName } from "../hooks/useZotmealStore";

export const RestaurantContext = createContext<{
  restaurantName: RestaurantName;
  image: ImageSourcePropType;
  data?: RestaurantInfo;
  skeletonValue: SharedValue<number>;
} | null>(null);
