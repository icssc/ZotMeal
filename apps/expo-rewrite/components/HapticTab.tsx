import React from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";

import { triggerHaptic } from "../utils/haptic";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        triggerHaptic();
        props.onPressIn?.(ev);
      }}
    />
  );
}
