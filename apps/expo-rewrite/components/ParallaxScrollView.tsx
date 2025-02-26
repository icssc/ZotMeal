import type { PropsWithChildren, ReactElement } from "react";
import React, { useContext } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { useColorScheme } from "../hooks/useColorScheme";
import { RestaurantName } from "../hooks/useZotmealStore";
import { RestaurantContext } from "./RestaurantContext";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useBottomTabOverflow } from "./ui/TabBarBackground";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

function Header({ restaurantName }: { restaurantName: RestaurantName }) {
  const insets = useSafeAreaInsets();

  // BlurView doesn't look good in Android
  if (Platform.OS === "android") {
    return (
      <ThemedView
        style={{
          width: "100%",
          height: "auto",
          position: "absolute",
          paddingHorizontal: 20,
          paddingTop: insets.top,
          paddingBottom: 10,
          zIndex: 100,
          justifyContent: "flex-end",
        }}
      >
        <ThemedText
          type="default"
          style={{
            fontSize: 22,
          }}
        >
          {restaurantName.charAt(0).toUpperCase() + restaurantName.slice(1)}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <BlurView
      intensity={100}
      style={{
        width: "100%",
        height: "auto",
        position: "absolute",
        paddingHorizontal: 20,
        paddingTop: insets.top,
        paddingBottom: 10,
        zIndex: 100,
        justifyContent: "flex-end",
      }}
    >
      <ThemedText
        type="default"
        style={{
          fontSize: 22,
        }}
      >
        {restaurantName.charAt(0).toUpperCase() + restaurantName.slice(1)}
      </ThemedText>
    </BlurView>
  );
}

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const { restaurantName } = useContext(RestaurantContext)!;
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
        [1, 1, 0],
      ),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Header restaurantName={restaurantName} />
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    borderTopWidth: 2,
    borderColor: "#309CFF",
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 16,
  },
});
