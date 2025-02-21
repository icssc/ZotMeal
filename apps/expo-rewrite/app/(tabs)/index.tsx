import React from "react";
import { useWindowDimensions } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import RestaurantView from "../../components/RestaurantView";

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const { width } = useWindowDimensions();
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + width }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <RestaurantView restaurantName="anteatery" />
    </Reanimated.View>
  );
}

export default function SwipeableRestaurantView() {
  return (
    <ReanimatedSwipeable
      containerStyle={{
        height: "100%",
        backgroundColor: "black",
        alignItems: "center",
      }}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
      overshootLeft={false}
      overshootRight={false}
    >
      <RestaurantView restaurantName="brandywine" />
    </ReanimatedSwipeable>
  );
}
