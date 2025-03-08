import React, { useCallback, useImperativeHandle } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { defaultSpringConfig } from "../constants/Animation";
import { useThemeColor } from "../hooks/useThemeColor";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const textColor = useThemeColor({}, "text");

    const scrollTo = useCallback((destination: number) => {
      "worklet";
      active.value = destination !== 0;

      translateY.value = withSpring(destination, defaultSpringConfig);
    }, []);

    const isActive = useCallback(() => active.value, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd((e) => {
        if (e.velocityY > 100) {
          scrollTo(0);
        } else if (e.velocityY < -100) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolation.CLAMP,
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const rBackdropStyle = useAnimatedStyle(
      () => ({
        opacity: withTiming(active.value ? 1 : 0),
      }),
      [],
    );

    const rBackdropProps = useAnimatedProps(() => {
      return {
        pointerEvents: active.value ? "auto" : "none",
      } as any;
    }, []);

    return (
      <>
        <Animated.View
          onTouchStart={() => {
            // Dismiss the BottomSheet
            scrollTo(0);
          }}
          animatedProps={rBackdropProps}
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.4)",
            },
            rBackdropStyle,
          ]}
        />
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.bottomSheetContainer, rBottomSheetStyle]}
          >
            <View
              style={{
                width: 75,
                height: 4,
                backgroundColor: textColor,
                alignSelf: "center",
                marginVertical: 10,
                borderRadius: 2,
              }}
            />
            {children}
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 100,
  },
});

export default BottomSheet;
